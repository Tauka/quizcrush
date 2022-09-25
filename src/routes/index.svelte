<style lang="scss">
  @use '~attractions/_variables';

  .container :global {
    .subhead {
      margin-bottom: 2rem;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
  }

  .filters-form :global {
    border: 2px solid variables.$main;
    border-radius: 15px;
    padding: 2rem 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn {
      margin-top: 3rem;
    }
  };

  .filters :global {
    display: flex;


    @media (max-width: 600px) {
      flex-direction: column;
    }
  };

  .source-filters {
  }

  .year-filters {
    @media (max-width: 600px) {
      margin-bottom: 2rem;
    }
  }

  :global(.disabled) {
    color: #888 !important;
  }

  :global(.source-radio) {
    display: flex;
    justify-content: space-between;
    margin-top: 0.65em;
    width: 16rem;
  };

  .year-filter-inputs :global {
    display: flex;
    align-items: center;

    .text-field {
      width: 83px;
    }
  };

  .header {
    margin-bottom: 4rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .dash {
    margin: 0 .5rem;
  }
</style>
<script>
  import { Button, Headline, FormField, TextField, Label, RadioGroup, Subhead, H2 } from 'attractions';
  import { fly } from 'svelte/transition';

  const items = [
    { value: 'top250', label: 'Top 250' },
    { value: 'mostPopular', label: 'Most popular', disabled: true },
  ];

  let startYear = 1995;
  let endYear = 2022;
  let name = ''
</script>
<div class="container" out:fly="{{ y: 50, duration: 300 }}">
  <div class="header">
    <Button href="/leaderboard">Leaderboard</Button>
  </div>
  <Headline> Guess movies by cast </Headline>
  <Subhead> Test your movie knowledge! </Subhead>
  <div class="filters-form">
    <div class="filters">
      <div style="margin-bottom: 2rem">
        <Label>
          Name
        </Label>
        <TextField bind:value={name}/>
      </div>
    </div>
    <Button href={`/quiz?startYear=${startYear}&endYear=${endYear}&name=${name}`} filled>Start quiz</Button>
  </div>
</div>
