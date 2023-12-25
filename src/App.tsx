import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import ProductCard from './components/ProductCard'
import Modal from './components/ui/Modal'
import { categories, colors, formInputsList, productList } from './data'
import Button from './components/ui/Button'
import Input from './components/ui/Input'
import { IProduct } from './interfaces'
import { productValidation } from './validation'
import ErrorMessage from './components/ErrorMessage'
import CircleColor from './components/CircleColor'
import { v4 as uuidv4 } from 'uuid';
import Select from './components/ui/Select'
import { ProductNameTypes } from './types'
import toast, { Toaster } from 'react-hot-toast';
function App() {
  const defaultProductObj = {
    title: '',
    description: '',
    imageURL: '',
    price: '',
    colors: [],
    category: {
      name: '',
      imageURL: ''
    }
  }
  const defaultErrorObj = {
    title: "", description: "", imageURL: "", price: ""
  }
  const [products, setProducts] = useState<IProduct[]>(productList)
  const [product, setPorduct] = useState<IProduct>(defaultProductObj)
  const [productToEdit, setProductToEdit] = useState<IProduct>(defaultProductObj)
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0)
  const [errors, setErrors] = useState(defaultErrorObj)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEditModel, setIsOpenEditModal] = useState(false)
  const [tempColor, setTempColor] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const openConfirmModal = () => setIsOpenConfirmModal(true);
  const closeConfirmModal = () => setIsOpenConfirmModal(false);
  const closeEditModal = () => setIsOpenEditModal(false);
  const openEditModal = () => setIsOpenEditModal(true);
  const onchangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPorduct({
      ...product,
      [name]: value
    })
    setErrors({ ...errors, [name]: '' })
  }
  const onchangeEditHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductToEdit({
      ...productToEdit,
      [name]: value
    })
    setErrors({ ...errors, [name]: '' })
  }
  const onCancel = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    event.preventDefault()
    setPorduct(defaultProductObj);
    setErrors(defaultErrorObj);
    closeModal();
  }
  const sumbitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { title, description, price, imageURL } = product;
    const errors = productValidation(
      {
        title: title,
        description: description,
        imageURL: imageURL,
        price: price,

      }
    )
    const hasErrorMsg = Object.values(errors).some(value => value == '') && Object.values(errors).every(value => value == '')
    if (!hasErrorMsg) {
      setErrors(errors)
      return;
    }
    setProducts(prev => [{ ...product, id: uuidv4(), colors: tempColor, category: selectedCategory }, ...prev])
    closeModal();
    setPorduct(defaultProductObj)
    setTempColor([]);
    toast('product has been added' , {
      icon: '👏',
      style : {
        backgroundColor: 'black',
        color: 'white'
      }
    });
  }
  const sumbitEditHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { title, description, price, imageURL } = productToEdit;
    const errors = productValidation(
      {
        title: title,
        description: description,
        imageURL: imageURL,
        price: price
      }
    )
    const hasErrorMsg = Object.values(errors).some(value => value == '') && Object.values(errors).every(value => value == '')
    if (!hasErrorMsg) {
      setErrors(errors)
      console.log(errors)
      return;
    }
    const updatedProducts = [...products]
    updatedProducts[productToEditIdx] = { ...productToEdit, colors: tempColor.concat(productToEdit.colors) };
    setProducts(updatedProducts)
    setProductToEdit(defaultProductObj)
    setTempColor([]);
    closeEditModal();
    toast('product has been updated' , {
      icon: '👏',
      style : {
        backgroundColor: 'black',
        color: 'white'
      }
    });

  }
  const pickColor = (color: string) => {
    if (tempColor.includes(color)) {
      setTempColor(prev => prev.filter(c => c !== color))
      return;
    }
    if (productToEdit.colors.includes(color)) {
      console.log("exist")
      let updateColors = productToEdit.colors.filter(c => c !== color)
      setProductToEdit({ ...productToEdit, colors: updateColors })
      return;
    }
    setTempColor(prev => [...prev, color]);
  }
  const removeProductHandler = () =>{
    const filterd = products.filter(product => product.id !== productToEdit.id)
    setProducts(filterd);
    closeConfirmModal();
    toast('product has been deleted' , {
      icon: '👏',
      style : {
        backgroundColor: 'black',
        color: 'white'
      }
    });
  }
  const renderProductList = products.map((product, idx) =>
  (
    <ProductCard
      openEditModal={openEditModal} setProductToEdit={setProductToEdit}
      key={product.id} setProductToEditIdx={setProductToEditIdx}
      product={product} idx={idx}
      openConfirmModal={openConfirmModal}
    />

  )
  )
  const renderFormInputList = formInputsList.map(input => (
    <div key={input.id} className='flex flex-col'>
      <label className='mb-2 text-sm font-medium' htmlFor={input.id}>{input.label}</label>
      <Input value={product[input.name]} onChange={onchangeHandler} type={input.type} id={input.id} name={input.name} />
      <ErrorMessage msg={errors[input.name]} />
    </div>
  ))
  const renderProductColors = colors.map(color => <CircleColor onClick={() => { pickColor(color) }} color={color} key={color} />)
  const renderProductEditwithErrorMsg = (id: string, label: string, name: ProductNameTypes) => {
    return (
      <div className='flex flex-col'>
        <label className='mb-2 text-sm font-medium' htmlFor={id}>
          {label}
        </label>
        <Input value={productToEdit[name]} onChange={onchangeEditHandler} type={'text'} id={id} name={name} />
        <ErrorMessage msg={errors[name]} />
      </div>
    )
  }

  return (
    <main className='container'>
      <div className="w-full flex justify-center my-10 px-10">
        <Button onClick={openModal} className='bg-indigo-700 min-w-fit max-w-lg hover:bg-indigo-800'>
          Build a product
        </Button>
      </div>
      <div className=' grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 m-5 rounded-xl '>
        {renderProductList}
      </div>
      {/* Add product modal */}
      <Modal title='ADD A NEW PRODUCT' isOpen={isOpen} closeModal={closeModal} >
        <form onSubmit={e => sumbitHandler(e)} className='space-y-3'>
          {renderFormInputList}
          <Select selected={selectedCategory} setSelected={setSelectedCategory} />
          <div className='flex items-center flex-wrap space-x-2'>
            {renderProductColors}
          </div>
          <div className="flex items-center flex-wrap space-x-1">
            {
              tempColor.map(color => (
                <span className='text-white p-1 mr-1 mb-1 text-xs rounded-md' style={{ backgroundColor: color }} key={color}>{color}</span>
              ))
            }
          </div>
          <div className='flex items-center space-x-3'>
            <Button className='bg-indigo-700 hover:bg-indigo-800'>
              Submit
            </Button>
            <Button onClick={(e) => { onCancel(e) }} className='bg-gray-400 hover:bg-gray-500'>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Edit product modal */}
      <Modal title='EDIT THIS PRODUCT' isOpen={isOpenEditModel} closeModal={closeEditModal} >
        <form onSubmit={sumbitEditHandler} className='space-y-3'>
          {/* edit products inputs */}
          {renderProductEditwithErrorMsg('title', 'Product Title', 'title')}
          {renderProductEditwithErrorMsg('description', 'Product Description', 'description')}
          {renderProductEditwithErrorMsg('image', 'Product Image', 'imageURL')}
          {renderProductEditwithErrorMsg('price', 'Product Price', 'price')}
          <Select selected={productToEdit.category} setSelected={(value) => setProductToEdit({ ...productToEdit, category: value })} />
          <div className='flex items-center flex-wrap space-x-2'>
            {renderProductColors}
          </div>
          <div className="flex items-center flex-wrap space-x-1">
            {
              tempColor.concat(productToEdit.colors).map(color => (
                <span className='text-white p-1 mr-1 mb-1 text-xs rounded-md' style={{ backgroundColor: color }} key={color}>{color}</span>
              ))
            }
          </div>
          {/* edit product buttons */}
          <div className='flex items-center space-x-3'>
            <Button className='bg-indigo-700 hover:bg-indigo-800'>
              Submit
            </Button>
            <Button onClick={closeEditModal} className='bg-[#f5f5fa] hover:bg-gray-300 !text-black'>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* remove product modal */}
      <Modal title='Are you sure you want to remove this Product from your Store?'
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action." >
        <div className="flex items-center space-x-3">
          <Button className="bg-[#c2344d] hover:bg-red-800" onClick={removeProductHandler}>
            Yes, remove
          </Button>
          <Button type="button" className="bg-[#f5f5fa] hover:bg-gray-300 !text-black" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Toaster />
    </main>
  )
}

export default App
