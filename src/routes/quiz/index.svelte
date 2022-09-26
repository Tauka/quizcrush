<style lang="scss">
  .container :global {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5%;
    height: 100vh;
    padding: 0 10px;

    .btn {
      margin-top: .5rem;
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
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: .5rem;

    .dot {
      margin-right: .5rem;
    }
  };

  .answer-card {
    width: 100%;
    padding: 12px 24px;
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
    margin-bottom: 0.5rem;
  }
</style>
<script>
  import { Button, Headline, FormField, TextField, Label, RadioGroup, Subhead, H2, H3, Dot } from 'attractions';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { shuffle } from './_utils.js';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import HeartIcon from './HeartIcon.svelte';

  import Spinner from './_spinner.svelte';
  import Question from './_Question.svelte';

  let loading = true;
  let currentMovie = null;
  let questionNumber = 0;
  let answers = [];
  let answerText = ''
  let submitted = false;
  let isCorrect = false;
  let lives = 10;
  let finished = false;

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
    const startYear = $page.url.searchParams.get('startYear');
    const endYear = $page.url.searchParams.get('endYear');

    const res = await fetch(`/api/movie?${$page.url.searchParams.toString()}`);

    const movie = await res.json();
    currentMovie = movie;
    loading = false;
  }

  const handleSubmit = () => {
    isCorrect = compareAnswer(currentMovie.name, answerText);
    answers = [...answers, isCorrect]

    if(!isCorrect)
      lives--;

    submitted = true;
  };

  const handleFinish = async () => {
    finished = true;
    const response = await fetch('/api/score', {
      method: 'POST',
      body: JSON.stringify({
        name: $page.url.searchParams.get('name'),
        score: answers.filter(Boolean).length
      })
    })

    const score = answers.filter(Boolean).length;
    const leaderboard  = await response.json();
    goto(`/leaderboard?insertIndex=${leaderboard.insertIndex}&score=${score}`)
  }

  const handleNext = () => {
    submitted = false;
    answerText = '';
    generateQuestion();
  };

  const range = n => {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push(i);
    }

    return list;
  }

  onMount(generateQuestion)

</script>
<div class="container">
  {#if loading || currentMovie === null}
    <div style="margin-top: 2rem"in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <div class="spinner-container">
        <Spinner/>
        <Subhead> Generating question </Subhead>
      </div>
    </div>
  {:else if finished}
    <div style="margin-top: 2rem"in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <div class="spinner-container">
        <Spinner/>
        <Subhead> Calculating results </Subhead>
      </div>
    </div>
  {:else}
    <div class="question-container" in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <div style="display: flex; margin-bottom: 0.5rem">
        {#each range(lives) as i}
          <div style="margin-left: 0.2rem">
            <HeartIcon/>
          </div>
        {/each}
      </div>
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
        {#if submitted && lives > 0}
          <Button filled on:click={handleNext}> Next </Button>
        {/if}
        {#if submitted && lives === 0}
          <Button filled on:click={handleFinish}> Finish </Button>
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
