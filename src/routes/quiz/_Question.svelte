<style lang="scss">
  .card-container {
  }

  .question {
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

  .input {
    width: 100%;
    border-radius: 10px;
    font-family: "Ubuntu";
    font-size: 14px;
  }

  .images {
    display: 'flex';
    flex-direction: 'row';
    margin-bottom: 2rem;
  }

  .star-image {
    margin-right: 2rem;
  }

  .submit {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
<script>
  import { TextField, Label, Button } from 'attractions';
  import { onMount } from 'svelte';

  export let movie;
</script>
<div class="card-container">
  <div class="question">
    <div class="images">
      {#each movie.imgs as img}
        <img class="star-image" src={img}/>
      {/each}
    </div>
  </div>
</div>
