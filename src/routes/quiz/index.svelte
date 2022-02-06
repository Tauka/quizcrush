<style lang="scss">
  .container :global {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 15%;
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
</style>
<script>
  import { Button, Headline, FormField, TextField, Label, RadioGroup, Subhead, H2, Dot } from 'attractions';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { shuffle } from './_utils.js';

  import Spinner from './_spinner.svelte';
  import Question from './_Question.svelte';

  export let movies = [];
  let loading = true;
  let currentMovie = null;
  let options = [];
  let premise = '';
  let selected = false;
  let seen = [];
  let questionNumber = 0;
  let answers = [];

  function randomMovie(ignoreList) {
    const randomIndex = Math.floor(Math.random() * 250);
    if(ignoreList.some(m => m.name === movies[randomIndex].name))
      return randomMovie(ignoreList)
    else
      return movies[randomIndex];
  }

  function generateOptions(movie) {
    const option1 = randomMovie([movie])
    const option2 = randomMovie([movie, option1])
    const option3 = randomMovie([movie, option1, option2])

    return [option1, option2, option3];
  }

  async function generateQuestion() {
    selected = false;
    loading = true;
    currentMovie = randomMovie(seen);
    options = shuffle([...generateOptions(currentMovie), currentMovie]);
    seen = [...seen, currentMovie ];
    questionNumber++;

    const res = await fetch(
      '/api/questionDescription',
      {
        method: 'POST',
        body: JSON.stringify({ link: currentMovie.href })
      });

    const response = await res.json();
    premise = response.premise;
    loading = false;
  }

  const handleSelect = (event) => {
    answers = [...answers, event.detail.correct];
    selected = true;
  };

  onMount(generateQuestion)

</script>
<div class="container">
  {#if loading}
    <div in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <div class="spinner-container">
        <Spinner/>
        <Subhead> Generating question </Subhead>
      </div>
    </div>
  {:else}
    <div class="question-container" in:fly="{{ y: 50, duration: 300, delay: 300 }}" out:fly="{{ y:50, duration: 300 }}">
      <H2>{questionNumber}</H2>
      <Question {premise} {options} movie={currentMovie} on:select={handleSelect}/>
      <div class="answer-dots">
        {#each answers as answer}
          {#if answer}
            <Dot success/>
          {:else}
            <Dot danger/>
          {/if}
        {/each}
      </div>
      {#if selected}
        <Button filled on:click={generateQuestion}> Next </Button>
      {/if}
    </div>
  {/if}
</div>
