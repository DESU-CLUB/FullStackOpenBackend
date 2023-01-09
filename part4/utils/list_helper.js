var _ = require("lodash") 

const dummy = (blogs) =>{
    return 1
}


const totalLikes = (blog) =>{
    const reducer = (sum,obj)=>{
        sum+=obj.likes
        return sum
    }
    return blog.reduce(reducer,0)
}

const favoriteBlog = (blog)=>{
    const reducer = (acc,obj) =>{
        acc.likes<obj.likes?acc=obj:acc=acc
        return acc
    }
    return blog.reduce(reducer,blog[0])
}

const mostBlogs = (blogs) =>{
    
    const counts = _.countBy(blogs,'author')
    const entries = _.entries(counts)
    const maximum = _.maxBy(entries,_.last)

    return {author: maximum[0],blogs:maximum[1]}
}

const favoriteBlogger = (blogs) =>{
    const group = _(blogs).groupBy('author')
                    .mapValues((item)=>{
                         return _.sumBy(item,'likes')
                    })
                    .entries()
                    .maxBy(_.last)
    favorite = {author:group[0],likes :group[1]}
    return favorite
}

module.exports = {dummy,totalLikes,favoriteBlog,mostBlogs, favoriteBlogger}