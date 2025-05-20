import Vue from 'vue';

Vue.directive('click-away', {
    bind(el, binding, vnode) {
        // Click/touchstart handler
        const handleOutsideClick = (e) => {
            e.stopPropagation();

            // Get the handler method name and the exclude array
            const { handler, exclude } = binding.value;

            // Check if the clicked element is excluded
            let clickedOnExcludedEl = false;
            if (exclude && exclude.length > 0) {
                exclude.forEach(refName => {
                    const excludedEl = vnode.parent.context.$refs[refName]?.$el;
                    if (excludedEl && excludedEl.contains(e.target)) {
                        clickedOnExcludedEl = true;
                    }
                });
            }

            // If the clicked element is outside the dialog and not excluded
            if (!el.contains(e.target) && !clickedOnExcludedEl) {
                vnode.context[handler]();
            }
        };

        // Save the handler reference on the element
        el._handleOutsideClick = handleOutsideClick;

        // Register click/touchstart event listeners
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
    },
    unbind(el) {
        // Unbind click/touchstart listeners
        document.removeEventListener('click', el._handleOutsideClick);
        document.removeEventListener('touchstart', el._handleOutsideClick);
        delete el._handleOutsideClick; // Clean up reference
    }
});