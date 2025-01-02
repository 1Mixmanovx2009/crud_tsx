import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { NumericFormat, NumericFormatProps } from 'react-number-format';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatAdapter = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values: { value: string }) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  },
);

export function InputReactNumberFormat() {
   const [value, setValue] = React.useState('1320');
  return (
    <FormControl>
      <FormLabel>React number format</FormLabel>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Placeholder"
        slotProps={{
          input: {
            component: NumericFormatAdapter,
          },
        }}
      />
    </FormControl>
  );
}

import './App.css';

const API_URL = 'https://676d28d40e299dd2ddfea145.mockapi.io/products';

interface Product {
  id: string;
  name: string;
  currentPrice: string;
  lastPrice: string;
  img: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const createOrUpdateProduct = async () => {
    try {
      if (editProduct.id) {
        await axios.put(`${API_URL}/${editProduct.id}`, editProduct);
      } else {
        await axios.post(API_URL, editProduct);
      }
      setEditProduct({});
      fetchProducts();
    } catch (error) {
      console.error('Error creating or updating product:', error);
    }
    window.scrollTo({ top: 100, behavior: 'smooth' }); // Scroll to top on update
  };
  const handleEdit = (product: Product) => {
    setEditProduct(product);
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">CRUD Application</h1>

      <div className="mb-4 flex">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editProduct.name || ''}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <FormControl>
          <Input
            type="number"
            name="currentPrice"
            placeholder="Current Price"
            value={editProduct.currentPrice || ''}
            onChange={handleInputChange}
            className="w-[300px] border p-2 mr-2" />
        </FormControl>
        <FormControl >
          <Input
            type="number"
            name="lastPrice"
            placeholder="Last Price"
            value={editProduct.lastPrice || ''}
            onChange={handleInputChange}
            className="w-[300px] border p-2 mr-2" />
        </FormControl>
        <button
          onClick={createOrUpdateProduct}
          className="bg-blue-500 text-white p-2">
          {editProduct.id ? 'Update' : 'Create'}
        </button>
      </div>
      <div>
        <div className='flex flex-wrap justify-around gap-10 items-center'>
          {products.map((product) => (
            <div className='w-[400px]'>
              <Card key={product.id} sx={{ maxWidth: 345, marginBottom: 20 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={product.img}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Price: ${product.currentPrice}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Price: ${product.lastPrice}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => handleEdit(product)} size="small">Uptdate</Button>
                  <Button onClick={() => deleteProduct(product.id)} size="small">Delete</Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
