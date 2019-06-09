
    Image
    /image
    /single_upload
    /multi_upload
    POST     (auth passed)
        input: file [jpeg,jpg,png]
        output: filename


/api/user  (auth)
    URL: /
        GET (disabled. Needs role)
            input: 
            output: [{_id,first_name, last_name, username, email, password, create_date, age}]
        POST
            input: first_name, last_name, username, email, password, age, image
            output: {message: "ok"}

    URL /:id
        PUT
            input: id,first_name, last_name, username, email, password, age, image
            output: {message: "ok"}
        DELETE (disabled. Needs role), needs data to be cleared
            input: id
            output: {message: "ok"}
        GET (disabled. Not needed for now)
            input: id
            output: _id,first_name, last_name, username, email, password, create_date, age, image

