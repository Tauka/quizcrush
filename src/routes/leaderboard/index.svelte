<style lang="scss">
  .insert-1 :global{
    tr:nth-child(1) {
      background-color: #c1e5cc;
    }
  }
  .insert-2 :global{
    tr:nth-child(2) {
      background-color: #c1e5cc;
    }
  }
  .insert-3 :global{
    tr:nth-child(3) {
      background-color: #c1e5cc;
    }
  }
  .insert-4 :global{
    tr:nth-child(4) {
      background-color: #c1e5cc;
    }
  }
  .insert-5 :global{
    tr:nth-child(5) {
      background-color: #c1e5cc;
    }
  }
  .insert-6 :global{
    tr:nth-child(6) {
      background-color: #c1e5cc;
    }
  }
  .insert-7 :global{
    tr:nth-child(7) {
      background-color: #c1e5cc;
    }
  }
  .insert-8 :global{
    tr:nth-child(8) {
      background-color: #c1e5cc;
    }
  }
  .insert-9 :global{
    tr:nth-child(9) {
      background-color: #c1e5cc;
    }
  }
  .insert-10 :global{
    tr:nth-child(10) {
      background-color: #c1e5cc;
    }
  }
</style>
<script>
  import { H1, H2, Table } from 'attractions';
  import { page } from '$app/stores';

  export let leaderboard = [];
  const insertIndex = $page.url.searchParams.get('insertIndex');
  const score = $page.url.searchParams.get('score');

  const headers = [
    { text: 'Name', value: 'name' },
    { text: 'Score', value: 'score' },
  ];
</script>
{#if score}
  <H2 style="text-align: center; padding-top: 2rem"> Your score: {score} </H2>
{/if}
<div class={insertIndex ? `insert-${Number(insertIndex) + 1}` : ''} style="display: flex; flex-direction: column; align-items: center; padding-top: 3rem">
  <H1>Top 10 scores</H1>
  <Table
    {headers}
    alternatingRows={false}
    items={leaderboard}
  />
</div>
