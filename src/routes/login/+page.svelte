<script lang="ts">
    import { goto } from '$app/navigation';
    import { WEBSITE_URL } from "$lib/constants";

    let revealPassword = $state(false);
    let loginScreen = $state(true);

    async function login() {

        try {
			await fetch(`${WEBSITE_URL}/login`, {
				method: "POST",
				body: JSON.stringify({
                    username: "me",
                    password: "password123"
                }),
				headers: {
					"Content-type": "application/json charset=UTF-8"
				}
			})
			.then((success) => console.log(success))
			.catch((reason) => console.log(reason))

		} catch (error) {
			throw error;
		}
    }


</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="top">
    <div class="login">
        <form>
            <div class="flex flex-col items-center justify-center">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col">
                        <label for="email">E-mail:</label>
                        <input id="email" value="" type="text" placeholder="Enter e-mail...">
                    </div>
                    <div class="flex flex-col">
                        <label for="password">Password:</label>
                        <div>
                            <input id="password" value="" type={revealPassword ? "text" : "password"} placeholder="Enter password...">
                            <input class="check" type="checkbox" bind:checked={revealPassword}>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        
        <div class="flex flex-col items-center justify-center gap-2 m-4">
            <button onclick={login}>Login</button>
            <div class="flex flex-col items-center justify-center">
                <p>Do you have an account?</p>
                <button onclick={() => goto("/signup")} class="signup">Sign-up</button>
            </div>
        </div>

    </div>
</div>

<style>

    .top {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: auto;
    }

    p {
        color: white;
    }

    label {
        font-weight: bold;
        color: white;
    }

    .login {
        background-color: var(--bg-color-secondary);
        border-radius: 1rem;
        width: 50%;
        height: 100%;
        padding: 2rem;
        box-shadow: 0px 0px 20px 2px var(--highlight);
    }

    .signup {
        background-color: unset;
        color: white;
        text-decoration: underline;
    }

    .signup:hover {
        background-color: unset;
        color: var(--highlight);
    }

    button {
        padding-inline: 0.5rem;
        border-radius: var(--border-radius);
        background-color: var(--button-color-default);
    }

    button:hover {
        background-color: var(--button-color-hover);
    }

    input {
        border-radius: var(--border-radius);
        border-color:rgba(255, 255, 255, 0);
        width: 15rem;
    }

    input::placeholder {
        color: grey;
    }

    .check {
        width: 1rem;
        height: 1rem;

        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 16q1.875 0 3.188-1.312T16.5 11.5t-1.312-3.187T12 7T8.813 8.313T7.5 11.5t1.313 3.188T12 16m0-1.8q-1.125 0-1.912-.788T9.3 11.5t.788-1.912T12 8.8t1.913.788t.787 1.912t-.787 1.913T12 14.2m0 4.8q-3.35 0-6.113-1.8t-4.362-4.75q-.125-.225-.187-.462t-.063-.488t.063-.488t.187-.462q1.6-2.95 4.363-4.75T12 4t6.113 1.8t4.362 4.75q.125.225.188.463t.062.487t-.062.488t-.188.462q-1.6 2.95-4.362 4.75T12 19'/%3E%3C/svg%3E");
        background-color: var(--button-color-default);

        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .check:checked {
        background: none;
        -webkit-mask-image: none;
        mask-image: none;

        width: 1rem;
        height: 1rem;

       --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m19.1 21.9l-3.5-3.45q-.875.275-1.775.413T12 19q-3.35 0-6.125-1.8t-4.35-4.75q-.125-.225-.187-.462t-.063-.488t.063-.488t.187-.462q.55-.975 1.175-1.9T4.15 7L2.075 4.9Q1.8 4.625 1.8 4.213t.3-.713q.275-.275.7-.275t.7.275l17 17q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275M12 16q.275 0 .525-.025t.5-.1l-5.4-5.4q-.075.25-.1.5T7.5 11.5q0 1.875 1.313 3.188T12 16m0-12q3.35 0 6.138 1.813t4.362 4.762q.125.2.188.438t.062.487t-.05.488t-.175.437q-.475.925-1.062 1.75t-1.313 1.55q-.35.35-.825.325t-.825-.375l-2-2q-.175-.175-.225-.413t.025-.487q.1-.325.15-.625t.05-.65q0-1.875-1.312-3.187T12 7q-.35 0-.65.05t-.625.15q-.25.075-.5.025T9.8 7l-.825-.825q-.475-.475-.312-1.1t.787-.8q.625-.125 1.263-.2T12 4m1.975 5.65q.275.325.462.713t.238.812q.025.2-.15.275t-.325-.075l-2.05-2.05Q12 9.175 12.088 9t.287-.175q.475.05.875.263t.725.562'/%3E%3C/svg%3E");
        color: var(--button-color-hover);
        
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

</style>