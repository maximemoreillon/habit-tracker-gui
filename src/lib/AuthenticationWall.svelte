<script lang ts>
	import { currentUser } from '$lib/firebase';
</script>

<div class="authentication_wall">
	<img src="/logo.png" alt="" class="authentication_wall_logo" />
	<h4>Habit tracker</h4>
</div>

<style>
	.authentication_wall {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: white;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.authentication_wall_logo {
		height: 12rem;
		width: 12rem;
		animation-name: rotating_logo;
		animation-duration: 60s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes rotating_logo {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
