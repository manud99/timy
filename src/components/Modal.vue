<template>
    <teleport to="body">
        <div
            class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
            :class="{'opacity-0': ! isOpen, 'pointer-events-none': ! isOpen}"
            style="transition: opacity 0.3s"
        >
            <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div class="modal-container bg-white w-2/3 lg:w-2/5 mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <form @submit.prevent="onSubmit" class="modal-content py-4 text-left px-6">
                    <div class="flex justify-between items-center pb-3">
                        <h2 class="text-2xl font-bold">Add time entry</h2>

                        <button class="modal-close cursor-pointer z-50" @click="close">
                            <svg class="fill-current text-black"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="18"
                                 height="18"
                                 viewBox="0 0 18 18">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center py-4">
                            <label for="title" class="w-full md:w-1/3 font-semibold text-lg pr-4">Title</label>
                            <input v-model="title" class="w-full md:w-2/3 border rounded px-4 py-2" type="text" id="title" name="title" placeholder="Title">
                        </div>
                    </div>

                    <!--Footer-->
                    <div class="flex flex-row-reverse">
                        <button
                            type="submit"
                            class="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            class="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
                            @click="close"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    emits: ['submit', 'open', 'close'],

    props: {
        entry: {
            type: Object,
        }
    },

    data() {
        return {
            isOpen: false,
            title: '',
        };
    },

    watch: {
        entry(entry) {
            this.onEntryUpdate(entry);
        },
    },

    methods: {
        open() {
            this.isOpen = true;

            this.$emit('open');
        },

        close() {
            this.isOpen = false;

            this.$emit('close');
        },

        onSubmit() {
            this.$emit('submit', {
                title: this.title,
            });

            this.close();
        },

        onEntryUpdate(entry) {
            if (!entry) {
                this.resetForm();
                return;
            }

            this.title = entry.title;
        },

        resetForm() {
            this.title = '';
        }
    },
};
</script>