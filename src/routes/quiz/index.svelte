<style lang="scss">
  .container :global {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5%;
    height: 100vh;

    .btn {
      margin-top: 2rem;
    }

    @media (max-width: 600px) {
      padding-top: 30%;
    }
  };

  .spinner-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .answer-dots :global {
    margin-top: 1rem;
    display: flex;
    margin-bottom: 1rem;
    width: 100%;

    .dot {
      margin-right: .5rem;
    }

    @media (max-width: 600px) {
      margin-top: 2rem;
    }
  };

  .answer-card {
    width: 100%;
    padding: 16px 24px;
    border-radius: 15px;
    border-width: 2px;
    border-style: solid;
  }

  .answer-card--right {
    border-color: #27ae60;
  }

  .answer-card--wrong {
    border-color: #e74c3c;
  }

  .controls {
    width: 200px;
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
  }
</style>
<script>
  import { Button, Headline, FormField, TextField, Label, RadioGroup, Subhead, H2, H3, Dot } from 'attractions';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { shuffle } from './_utils.js';
  import { page } from '$app/stores';

  import Spinner from './_spinner.svelte';
  import Question from './_Question.svelte';

  let loading = true;
  let currentMovie = null;
  let questionNumber = 0;
  let answers = [];
  let answerText = ''
  let submitted = false;
  let isCorrect = false;

  const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i];
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
      }
    }
    return arr[t.length][s.length];
  };

  const compareAnswer = (full, short) => {
    full = full.toLowerCase().replace(/\s/g, "");
    short = short.toLowerCase().replace(/\s/g, "");

    if(short.length > 1 && full.includes(short))
      return true;

    const distance = levenshteinDistance(full, short);

    if(full.length <= 5 && distance <= 1)
      return true;

    if(full.length > 5 && full.length <= 10 && distance <= 2)
      return true;

    if(full.length > 10 && full.length <= 15 && distance <= 3)
      return true;

    return false;
  };

  async function generateQuestion() {
    loading = true;
    questionNumber = questionNumber + 1;
    console.log("question number", questionNumber);
    const startYear = $page.url.searchParams.get('startYear');
    const endYear = $page.url.searchParams.get('endYear');

    const res = await fetch(`/api/movie?${$page.url.searchParams.toString()}`);

    const movie = await res.json();
    currentMovie = movie;
    console.log("currentMovie", currentMovie);
    loading = false;
  }

  const handleSubmit = (event) => {
    isCorrect = compareAnswer(currentMovie.name, answerText);
    answers = [...answers, isCorrect]
    submitted = true;
  };

  const handleNext = () => {
    submitted = false;
    answerText = '';
    generateQuestion();
  };

  onMount(() => {
    generateQuestion();
    console.log("remount");
  })

</script>
<div class="container">
  {#if loading || currentMovie === null}
    <div in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <div class="spinner-container">
        <Spinner/>
        <Subhead> Generating question </Subhead>
      </div>
    </div>
  {:else}
    <div class="question-container" in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <H2>{questionNumber}</H2>
      <Question movie={currentMovie}/>
      <div class="answer-dots">
        {#each answers as answer}
          {#if answer}
            <Dot success/>
          {:else}
            <Dot danger/>
          {/if}
        {/each}
      </div>
      <div style="width: 100%">
        <Label>Movie name: </Label>
        <TextField bind:value={answerText}/>
      </div>
      <div class="controls">
        <Button filled disabled={submitted} on:click={handleSubmit}> Submit </Button>
        {#if submitted}
          <Button filled on:click={handleNext}> Next </Button>
        {/if}
      </div>
      {#if submitted}
        <div class={`answer-card ${isCorrect ? 'answer-card--right' : 'answer-card--wrong'}`}>
          <Label>Answer: </Label>
          <H3>{currentMovie.name}</H3>
        </div>
      {/if}
    </div>
  {/if}
</div>
