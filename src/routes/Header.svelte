<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<header>
	<nav> <!-- provides accesibility for screen readers -->
		<ul>
			<li aria-current={page.url.pathname === '/login' ? 'page' : undefined}> <!-- Temporary -->
				<a href={resolve('/login')}>Login</a>
			</li>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/templates' ? 'page' : undefined}>
				<a href={resolve('/templates')}>Templates</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		background-color: var(--bg-color-primary);
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	ul {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		background: var(--background);
		background-size: contain;
	}

	li {
		border-radius: var(--border-rounded);
		height: 100%;
		background-color: var(--button-color-default);
		margin: 0 1rem;
		padding: 0 0.5rem;
		border-radius: var(--border-radius);
	}

	li:hover {
		background-color: var(--button-color-hover);
	}

	nav a {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		width: 6rem;
	}
</style>
