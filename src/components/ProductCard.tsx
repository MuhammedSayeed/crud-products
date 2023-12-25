import { IProduct } from '../interfaces'
import { numberWithCommas, textSlicer } from '../utils/functions'
import CircleColor from './CircleColor'
import Image from './Image'
import Button from './ui/Button'

interface IProps {
  product: IProduct,
  setProductToEdit: (product: IProduct) => void,
  setProductToEditIdx: (value: number) => void,
  idx: number,
  openEditModal: () => void,
  openConfirmModal: () => void
}

const ProductCard = ({ product, setProductToEdit, openEditModal, idx, setProductToEditIdx , openConfirmModal }: IProps) => {
  const { title, category, colors, description, imageURL, price, } = product;
  const renderProductColors = colors.map(color => <CircleColor color={color} key={color} />)
  const onEdit = () => {
    setProductToEdit(product)
    openEditModal()
    setProductToEditIdx(idx)
  }
  const onRemove = () => {
    setProductToEdit(product);
    openConfirmModal();
  }

  return <div className='max-w-sm md:max-w-lg mx-auto md:mx-0 border rounded-md p-2 flex flex-col space-y-3'>
    <Image imgUrl={imageURL}
      alt='product' className='rounded-md h-52 w-full lg:object-cover ' />
    <h3 className='text-lg font-semibold'>{textSlicer(title, 25)}</h3>
    <p className='text-md text-gray-500 break-words'>{textSlicer(description)}</p>
    <div className='flex items-center flex-wrap space-x-2'>
      {!colors.length ? <p className='min-h-[20px]'>Not available colors!</p> : renderProductColors}
    </div>

    <div className='flex items-center justify-between'>
      <span className='text-lg text-indigo-600 font-semibold'>${numberWithCommas(price)}</span>
      <div className='flex items-center space-x-2'>
      <span className='text-sm font-semibold'>{category.name}</span>
      <Image
        imgUrl={category.imageURL}
        alt={category.name} className='w-10 h-10 rounded-full object-center' />
      </div>
      
    </div>
    <div className='flex justify-between items-center space-x-2 mt-5'>
      <Button onClick={onEdit} className='bg-indigo-700 hover:bg-indigo-800' >Edit</Button>
      <Button onClick={onRemove} className='bg-[#c2344d] hover:bg-red-800' >Remove</Button>
    </div>
  </div>
}

export default ProductCard