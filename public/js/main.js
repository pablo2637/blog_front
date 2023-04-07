document.addEventListener('DOMContentLoaded', () => {

    const divMenu = document.querySelector('#divMenu');

    document.addEventListener('click', ev => {

        if (ev.target.matches('i')) {
            console.log('click', ev.target)

            if (ev.target.classList.contains('iBtnMenu'))
                divMenu.classList.toggle('mostrarNav');


            if (ev.target.classList.contains('deleteEntry'))
                showWarning(ev.target);
            else if (ev.target.classList.contains('cancelDelete'))
                showWarning(ev.target);

        } else {
            
            if (divMenu.classList.contains('mostrarNav'))
                divMenu.classList.toggle('mostrarNav');

        }

    });


    const showWarning = el => {

        const tr = document.querySelector(`#tr${el.dataset.entryid}`);
        tr.classList.toggle('ocultar');

    };


    const init = () => {
        // divMenu.classList.toggle('mostrarNav');
    };


    init();

}); //Load