import React from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input'

const Login = () => {
  return (
    <div>
      <AuthLayout>
        <div className=''>
          <h3 className=''>Welcome Back</h3>
          <p className=''>Plese enter details in login</p>

          <form>
            <Input/>
            <Input/>
          </form>
        </div>
      </AuthLayout>
    </div>
  )
}

export default Login
