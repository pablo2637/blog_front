document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', ev => {
        console.log('click', ev.target)

        if (ev.target.matches('i')) {

            if (ev.target.classList.contains('deleteEntry'))
                showWarning(ev.target);
            else if (ev.target.classList.contains('cancelDelete'))
                showWarning(ev.target);

        }

    });


    const showWarning = el => {

        const tr = document.querySelector(`#tr${el.dataset.entryid}`);
        tr.classList.toggle('ocultar');

    };

}); //Load