import React from 'react'

const Footer = () => {
  return (
    <div className='w-full fixed bottom-0 bg-slate-800 text-white flex justify-center items-center px-4'>

      <div className='w-full max-w-[1550px] flex flex-col items-center justify-center py-3 gap-2'>

        <div className="logo font-bold text-lg sm:text-xl md:text-2xl text-center">
          <span className='text-green-500'>
            &lt;
          </span>
          Pass
          <span className='text-green-500'>
            OP/&gt;
          </span>
        </div>

        <div className='flex items-center justify-center'>
          <img className='w-6 sm:w-8 md:w-10' src="/heart.png" alt="" />
        </div>

      </div>

    </div>
  )
}

export default Footer