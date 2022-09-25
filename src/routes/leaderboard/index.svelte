<script>
  import { H2, Table } from 'attractions';
  import { page } from '$app/stores';

  export let leaderboard = [];
  const score = $page.url.searchParams.get('insertIndex');

  const headers = [
    { text: 'Name', value: 'name' },
    { text: 'Score', value: 'score' },
  ];
</script>
<div style="display: flex; justify-content: center; padding-top: 5rem;">
  <Table
    {headers}
    items={leaderboard}
  />
</div>
