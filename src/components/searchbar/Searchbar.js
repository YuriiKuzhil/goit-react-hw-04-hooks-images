import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  SearchbarHeader,
  SearchForm,
  Button,
  ButtonText,
  FormInput,
  ButtonIcon,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [imageName, setImageName] = useState('');

  const handleNameChange = event => {
    setImageName(event.target.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (imageName.trim() === '') {
      toast.error('Empty query!', {
        style: {
          border: '1px solid #E8301C',
          color: '#E8301C',
        },
      });
      return;
    }
    onSubmit(imageName);
    setImageName('');
  };

  return (
    <SearchbarHeader>
      <SearchForm onSubmit={handleSubmit}>
        <Button type="submit">
          <ButtonIcon />
          <ButtonText>Search</ButtonText>
        </Button>

        <FormInput
          onChange={handleNameChange}
          name="imageName"
          value={imageName}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarHeader>
  );
}
Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
