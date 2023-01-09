const reverse = (string) =>{
    return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) =>{
    const reduced = array.reduce((sum,number) =>{
        sum+=number
        console.log(sum,number)
        return sum
    },0)
    console.log(reduced)
    return reduced/array.length
}

module.exports = {reverse,average}

