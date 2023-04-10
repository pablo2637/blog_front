document.addEventListener('DOMContentLoaded', () => {

    const divMenu = document.querySelector('#divMenu');
    const formPages = document.querySelector('.formPages');
    const selPage = document.querySelector('#page');

    document.addEventListener('click', ({ target }) => {
        // console.log('click', target)
        if (target.matches('i')) {

            if (target.id == 'nextPage') {
                
                selPage.value = parseInt(selPage.value) + 1;                
                formPages.submit();
            }

            if (target.id == 'prevPage') {
                
                selPage.value = parseInt(selPage.value) - 1;                
                formPages.submit();
            }


            if (target.classList.contains('iBtnMenu'))
                divMenu.classList.toggle('mostrarNav');


            if (target.classList.contains('deleteEntry'))
                showWarning(target);

            else if (target.classList.contains('cancelDelete'))
                showWarning(target);

        } else {

            if (divMenu.classList.contains('mostrarNav'))
                divMenu.classList.toggle('mostrarNav');

        }

    });


    document.addEventListener('change', ({ target }) => {
        // console.log('change', target.parentNode)
        if (target.matches('select'))
            formPages.submit();

    });


    const showWarning = el => {

        const tr = document.querySelector(`#tr${el.dataset.entryid}`);
        tr.classList.toggle('ocultar');

    };

}); //Load