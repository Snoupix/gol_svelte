<script lang="ts">
    import { onMount } from "svelte";

    import { size, DEFAULT_SIZE } from "./state";
    import Game from "./lib/game.svelte";

    let game_ref: Game | null = null;
    let is_running = false;

    onMount(() => {
        return () => stop();
    });
</script>

<main>
    <div>
        <input
            type="number"
            placeholder="grid size"
            aria-details="grid size"
            on:change={(e) => {
                if (parseInt(e.currentTarget.value) <= 0 || parseInt(e.currentTarget.value) > 1000) {
                    $size = DEFAULT_SIZE;
                }
            }}
            bind:value={$size}
        >
        {#if game_ref != null}
            <button on:click={() => is_running ? game_ref?.reset() : game_ref?.run()}>
                {is_running ? "Stop" : "Start"}
            </button>
        {/if}

        <Game bind:this={game_ref} on:state_change={state => is_running = state.detail.is_running} />
    </div>
</main>

<style>
    * {
        user-select: none;
    }
</style>
