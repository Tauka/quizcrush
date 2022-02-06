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
    padding-top: 5rem;
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
    margin-right: 2rem;

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

  .dash {
    margin: 0 .5rem;
  }
</style>
<script>
  import { Button, Headline, FormField, TextField, Label, RadioGroup, Subhead } from 'attractions';
  import { fly } from 'svelte/transition';

  const items = [
    { value: 'top250', label: 'Top 250' },
    { value: 'mostPopular', label: 'Most popular', disabled: true },
  ];

  let startYear = 1990;
  let endYear = 2022;
  let source = 'top250';

</script>
<div class="container" out:fly="{{ y: 50, duration: 300 }}">
  <Headline> Quiz Crush </Headline>
  <Subhead> Test your movie knowledge! </Subhead>
  <div class="filters-form">
    <div class="filters">
      <div class="year-filters">
        <Label class={source === 'top250' ? 'disabled' : undefined}>
          Years
        </Label>
        <div class="year-filter-inputs">
          <TextField outline disabled={source === 'top250'} type="number" noSpinner bind:value={startYear}/>
          <span class="dash"> — </span>
          <TextField outline disabled={source === 'top250'} type="number" noSpinner bind:value={endYear}/>
        </div>
      </div>
      <div class="source-filters">
        <Label>
          Source
        </Label>
        <RadioGroup {items} bind:value={source} name="numbers" class="source-radio" />
      </div>
    </div>
    <Button href={`/quiz?source=${source}${source !== 'top250' ? `&startYear=${startYear}&endYear=${endYear}` : ''}`} filled>Start quiz</Button>
  </div>
</div>
