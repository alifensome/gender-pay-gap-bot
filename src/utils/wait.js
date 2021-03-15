async function wait(time = 3000) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 3000)
    })
}

export { wait }