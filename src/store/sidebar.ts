import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		return {
			collapse: false,
			items: []
		};
	},
	getters: {},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse;
		},
		handleSetMenu(items) {
			this.items = items;
		},
	}
});
