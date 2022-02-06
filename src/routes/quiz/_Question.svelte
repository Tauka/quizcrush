<style lang="scss">
  .card-container {
  }

  .question {
    width: 40rem;

    @media (max-width: 600px) {
      width: 100%;
      padding: 0 1rem;
    }
  }

  .question :global {
    .question-card {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .option-card {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .option-card[data-correct="true"] {
      border-color: #27ae60;
      background-color: #27ae60;
      color: white;
    }

    .option-card[data-correct="false"] {
      border-color: #e74c3c;
      background-color: #e74c3c;
      color: white;
    }
  }

  .options {
    display: grid;
    grid-template-columns: 48% 48%;
    grid-template-rows: 45% 45%;
    column-gap: 4%;
    row-gap: 10%;

    @media (max-width: 600px) {
      grid-template-rows: 35% 35%;
      row-gap: 30%;
    }
  }
</style>
<script>
  import { Card } from 'attractions';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let movie;
  export let options;
  export let premise = ''
  let chosenAnswerIndex = null;
  const rightAnswerIndex = options.findIndex(o => o.name === movie.name);

  const handleCardClick = (movieName) => {
    if(chosenAnswerIndex === null)
      chosenAnswerIndex = options.findIndex(o => o.name === movieName);

      dispatch('select', { correct: chosenAnswerIndex === rightAnswerIndex });
  }
</script>
<div class="card-container">
  <div class="question">
    <Card class="question-card">{premise}</Card>
    <div class="options">
      {#each options as { name }, i}
        <div on:click={() => handleCardClick(name)}>
          {#if chosenAnswerIndex !== null && chosenAnswerIndex === i}
            <Card outline class="option-card" data-correct="{chosenAnswerIndex === rightAnswerIndex}">
              {name}
            </Card>
          {:else if chosenAnswerIndex !== null && i === rightAnswerIndex}
            <Card outline class="option-card" data-correct="true">
              {name}
            </Card>
          {:else}
            <Card outline class="option-card">
              {name}
            </Card>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
