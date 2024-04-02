// action for counter

export const increment = () => {
    return {
        type: 'INCREMENT',
        payload: 1
    }
}

export const decrement = () => {
    return {
        type: 'DECREMENT',
        payload: 1
    }
}

