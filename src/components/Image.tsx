import React from 'react'

interface IProps {
    imgUrl: string,
    alt: string,
    className : string
}

const Image = ({ imgUrl, alt , className }: IProps) => {
    return <>
        <img className={className} src={imgUrl} alt={alt} />
    </> 
}

export default Image