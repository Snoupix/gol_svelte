<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import { size } from "../state";

    const dispatch = createEventDispatcher();

    let is_mouse_down = false;
    let generation = 0;
    let loop: number | null;
    let board: Array<Array<{ id: number, value: boolean }>> = [];
    let is_running = false;

    $: dispatch("state_change", { is_running });

    const init = () => {
        for (let x = 0; x < $size; x++) {
            board[x] = [];

            for (let y = 0; y < $size; y++) {
                board[x][y] = { id: x + y, value: false };
            }
        }
    };

    onDestroy(size.subscribe(init));

    const get_neighbours = (x: number, y: number) => {
        let neighbours: number = 0;

        for (const xi of [-1, 0, 1]) {
            if (x + xi < 0 || x + xi >= $size) continue;

            for (const yj of [-1, 0, 1]) {
                if ((y + yj < 0 || y + yj >= $size) || (xi == 0 && yj == 0)) continue;

                if (board[x + xi][y + yj].value) {
                    neighbours++;
                }
            }
        }

        return neighbours;
    };

    const next_generation = () => {
        if (!is_running) return;

        let changes = 0;
        let _board: typeof board = [];

        for (let x = 0; x < $size; x++) {
            _board[x] = board[x];

            for (let y = 0; y < $size; y++) {
                const neighbours = get_neighbours(x, y);
                let changed = false;

                if (board[x][y].value) {
                    changed = neighbours == 2 || neighbours == 3;
                } else {
                    changed = neighbours == 3;
                }

                if (changed) {
                    changes += 1;
                }

                _board[x][y] = {
                    id: board[x][y].id,
                    value: changed,
                };
            }
        }

        board = _board;

        if (changes == 0 && loop != null) {
            clearInterval(loop);
        }
    };

    const game_loop = () => {
        if (!is_running && loop != null) {
            clearInterval(loop);
            return;
        }

        next_generation();
        generation += 1;
    };

    export const run = () => {
        is_running = true;
        loop = setInterval(game_loop, 100);
    };

    export const reset = () => {
        if (loop) {
            clearInterval(loop);
        }
        is_running = false;

        board = [];
        generation = 0;
        init();
    }

    onMount(() => {
        init();

        return () => stop();
    });
</script>

<span>{`Generation n°${generation}`}</span>
<div role="none" on:mousedown={() => is_mouse_down = true} on:mouseup={() => is_mouse_down = false}>
    <div id="game">
        {#each board as row, x}
            <div class="row">
                {#each row as col, y (col.id)}
                    <div
                        role="none"
                        class={`cell ${col.value ? 'white' : 'black'}`}
                        on:mouseenter={() => is_mouse_down ? board[x][y].value = !col.value : null}
                    ></div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    #game {
        display: flex;
        flex-direction: column;
    }

    button {
        background: none;
        border: none;
    }

    .row {
        display: flex;
        flex-direction: row;
    }

    .cell {
        width: 10px!important;
        height: 10px!important;
    }

    .white {
        background-color: white;
    }

    .black {
        background-color: black;
    }
</style>
