// src/redux/slices/categorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";


// ================= GET ALL =================
export const getCategories = createAsyncThunk(
  "category/getCategories",

  async (_, thunkAPI) => {
    try {

      const state = thunkAPI.getState();

      // Redux me data already hai to API call mat karo
      if (state.category.categories.length > 0) {
        return state.category.categories;
      }


      const { data } = await API.get("/category");

      return data.data;


    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 
        "Failed to fetch categories"
      );

    }
  }
);



// ================= GET SINGLE =================
export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",

  async (id, thunkAPI) => {

    try {

      const { data } = await API.get(`/category/${id}`);

      return data.data;


    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch category"
      );

    }
  }
);



// ================= CREATE =================
export const createCategory = createAsyncThunk(
  "category/createCategory",

  async (formData, thunkAPI) => {

    try {

      const { data } = await API.post(
        "/category",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data",
          },
        }
      );


      return data.data;


    } catch(error){

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to create category"
      );

    }

  }
);



// ================= UPDATE =================
export const updateCategory = createAsyncThunk(
  "category/updateCategory",

  async ({id, formData}, thunkAPI)=>{

    try{

      const {data}= await API.put(
        `/category/${id}`,
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data",
          },
        }
      );


      return data.data;


    }catch(error){

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to update category"
      );

    }

  }
);




// ================= DELETE =================
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",

  async(id, thunkAPI)=>{

    try{

      await API.delete(`/category/${id}`);

      return id;


    }catch(error){

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete category"
      );

    }

  }
);





// ================= SLICE =================

const categorySlice = createSlice({

  name:"category",


  initialState:{

    categories:[],

    selectedCategory:null,

    loading:false,

    status:"idle",

    error:null,

  },



  reducers:{


    clearSelectedCategory:(state)=>{

      state.selectedCategory=null;

    },


    clearCategoryError:(state)=>{

      state.error=null;

    },



    // agar logout ke time clear karna ho
    clearCategories:(state)=>{

      state.categories=[];

      state.status="idle";

    }

  },




  extraReducers:(builder)=>{


    builder



    // ================= GET ALL =================


    .addCase(getCategories.pending,(state)=>{

      state.loading=true;

      state.status="loading";

      state.error=null;

    })


    .addCase(getCategories.fulfilled,(state,action)=>{


      state.loading=false;

      state.status="success";


      state.categories=action.payload;


    })



    .addCase(getCategories.rejected,(state,action)=>{


      state.loading=false;

      state.status="failed";


      state.error=action.payload;


    })





    // ================= GET SINGLE =================


    .addCase(getCategoryById.pending,(state)=>{

      state.loading=true;

    })


    .addCase(getCategoryById.fulfilled,(state,action)=>{

      state.loading=false;

      state.selectedCategory=action.payload;

    })


    .addCase(getCategoryById.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    })






    // ================= CREATE =================


    .addCase(createCategory.fulfilled,(state,action)=>{


      state.loading=false;


      state.categories.unshift(
        action.payload
      );


    })



    .addCase(createCategory.rejected,(state,action)=>{


      state.loading=false;

      state.error=action.payload;


    })


    .addCase(updateCategory.fulfilled,(state,action)=>{
      state.loading=false;
      const index =
      state.categories.findIndex(
        item=>item._id === action.payload._id
      );
      if(index !== -1){

        state.categories[index]=action.payload;

      }

      state.selectedCategory=action.payload;


    })

    .addCase(updateCategory.rejected,(state,action)=>{


      state.loading=false;

      state.error=action.payload;


    })

    .addCase(deleteCategory.fulfilled,(state,action)=>{


      state.loading=false;



      state.categories =
      state.categories.filter(
        item=>item._id !== action.payload
      );
    })
    .addCase(deleteCategory.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;


    });

  },
});

export const {
  clearSelectedCategory,
  clearCategoryError,
  clearCategories
}=categorySlice.actions;



export default categorySlice.reducer;