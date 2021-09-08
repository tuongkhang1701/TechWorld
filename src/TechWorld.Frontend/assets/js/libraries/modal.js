function modal({open = '', close = ''}) {
    let btnopen = document.getElementById(open);
    let btnClose = document.getElementById(close);
    let modal = document.getElementById('modal');
    btnopen.addEventListener('click', (e)=>{
        e.preventDefault();
        if(!modal.classList.contains('show'))
            modal.classList.add('show');
    });

    btnClose.addEventListener('click', (e)=>{
        e.preventDefault();
        if(modal.classList.contains('show'))
            modal.classList.remove('show');
    });
}

