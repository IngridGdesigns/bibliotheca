import React from "react";
import { useForm } from "react-hook-form";
import { useAuth0 } from '@auth0/auth0-react';

const AddBookForm = ({handleAddBook}) => {
const { user } = useAuth0();
    const { register, handleSubmit, formState: { errors }} = useForm();


    const onSubmit = (data) => {
        const issued_by = user.sub
        const formData = {...data, issued_by}
        handleAddBook(formData); //pass the form to book management function handleAddBook
        console.log(errors);
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}
      >
            {/* onSubmit={handleSubmit(onSubmit)}> */}
  
    <input type="text" placeholder="author_name" {...register("author_name", { required: true })} />
    <input type="text" placeholder="category_name" {...register("category_name", {})} />
    <input type="text" placeholder="publisher_name" {...register("publisher_name", {})} />
    <input type="text" placeholder="title" {...register("title", {required: true})} />
    <input type="text" placeholder="description" {...register("description", {required: true})} />
    <input type="text" placeholder="publication_year" {...register("publication_year",{} )} />
    <input type="number" placeholder="pages" {...register("pages", {})} />
    <input type="text" placeholder="isbn" {...register} />
    <input type="text" placeholder="language" {...register("language", {})} />


      <input type="submit" />
    </form>
  );
}

export default AddBookForm