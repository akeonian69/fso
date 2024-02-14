const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length == 0) {
        return undefined
    }
    return blogs.reduce((favBlog, blog) => {
        if (blog.likes > favBlog.likes) {
            return blog
        }
        return favBlog
    })
}

const mostBlogs = blogs => {
    if (blogs.length == 0) {
        return undefined
    }
    const authorBlogs = {}
    blogs.forEach(blog => {
        authorBlogs[blog.author] = 1 + (authorBlogs[blog.author] || 0)
    });
    const authors = Object.keys(authorBlogs).map(key => {
        return {
            author: key,
            blogs: authorBlogs[key]
        }
    })
    return authors.reduce((m, a) => {
        if (a.blogs > m.blogs) {
            return a
        }
        return m
    })
}

const mostLikes = blogs => {
    if (blogs.length == 0) {
        return undefined
    }
    const authorLikes = {}
    blogs.forEach(blog => {
        authorLikes[blog.author] = blog.likes + (authorLikes[blog.author] || 0)
    });
    const authors = Object.keys(authorLikes).map(key => {
        return {
            author: key,
            likes: authorLikes[key]
        }
    })
    return authors.reduce((m, a) => {
        if (a.likes > m.likes) {
            return a
        }
        return m
    })
}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}