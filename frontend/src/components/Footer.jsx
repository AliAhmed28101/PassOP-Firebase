import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-col  bg-slate-800 text-white justify-center items-center fixed bottom-0 w-full'>

      <div className="logo font-bold text-2xl">
        
        <span className='text-green-500'> 

                &lt;
        </span>
       Pass

         <span className='text-green-500'>
                 OP/&gt;
        </span>
       
       
        
        </div>

      <div className='flex items-center justify-center gap-2'>
     <img className='w-10' src="/heart.png" alt="" /> 
      </div>
      
    </div>
  )
}

export default Footer
