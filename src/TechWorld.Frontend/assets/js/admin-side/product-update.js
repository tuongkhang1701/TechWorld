function getDataFormUpdate() {
    let formData = document.querySelectorAll('#formData-update input');
    let data = Array.from(formData).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    return data;
}