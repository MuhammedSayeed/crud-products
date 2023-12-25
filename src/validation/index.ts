export const productValidation = (product: { title: string , description : string , imageURL: string , price : string }) => {
    // **Retruns an Object**
    const errors: { title: string, description: string, imageURL: string, price: string } = {
        title: '',
        description: '',
        imageURL: '',
        price: ''
        
    };
    const validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(product.imageURL);
    if (!product.title.trim() || product.title.length < 3 || product.title.length > 80) {
        errors.title = 'Product title must be between 10 and 80 characters';
    }
    if (!product.description.trim() || product.description.length < 10 || product.description.length > 900) {
        errors.description = 'Product title must be between 10 and 250 characters';
    } 
    if (!product.imageURL.trim() || !validUrl) {
        errors.imageURL = 'Image URL is not valid';
    }
    if(!product.price.trim() || isNaN(Number(product.price)) ){
        errors.price = 'valid price is required!';
    }
    
    return errors;
}



