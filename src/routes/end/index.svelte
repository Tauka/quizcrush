<script>
  import { H2 } from 'attractions';
  import { page } from '$app/stores';

  const score = $page.url.searchParams.get('score');
</script>
<div style="display: flex; justify-content: center; padding-top: 5rem;">
  <H2>
    Your score: 
  </H2>
</div>
