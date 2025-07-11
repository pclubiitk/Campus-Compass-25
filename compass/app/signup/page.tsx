// // import { Metadata } from 'next';

// // export const metadata: Metadata = {
// //   title: 'Login / Sign up',
// // };

// // export default function Page() {
// //   return <div><p>Login / Signup (implement email verification)</p>
// //   <button>Login</button></div>;
// // }
// // import { Metadata } from 'next';

// // export const metadata: Metadata = {
// //   title: 'Login / Sign up',
// // };

// // export default function Page() {
// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen p-4">
// //       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
// //         <h1 className="text-2xl font-bold text-center">Login / Sign up</h1>
// //         <p className="text-gray-600 text-center">(implementing email verification)</p>
// //         <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
// //           Login
// //         </button>

// //       </div>
// //     </div>
// //   );
// // }
// // import { Metadata } from 'next';

// // export const metadata: Metadata = {
// //   title: 'Sign Up',
// // };

// // export default function Page() {
// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen p-4">
// //       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
// //         <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        
// //         <form action="/api/signup" method="POST" className="space-y-4">
// //           <div>
// //             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// //               Email
// //             </label>
// //             <input
// //               type="email"
// //               id="email"
// //               name="email"
// //               required
// //               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="id" className="block text-sm font-medium text-gray-700">
// //               Password
// //             </label>
// //             <input
// //               type="text"
// //               id="id"
// //               name="id"
// //               required
// //               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
// //               Profile Photo (Optional)
// //             </label>
// //             <input
// //               type="file"
// //               id="photo"
// //               name="photo"
// //               accept="image/*"
// //               className="w-full px-3 py-2 mt-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
// //           >
// //             Sign Up
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client'; // Required for client-side interactivity

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function SignupPage() {
//   const [email, setEmail] = useState('');
//   const [id, setId] = useState('');
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError(null);

//   //   try {
//   //     // Prepare form data (including file if needed)
//   //     const formData = new FormData();
//   //     formData.append('email', email);
//   //     formData.append('id', id);
//   //     if (photo) formData.append('photo', photo);

//   //     // Directly call Golang backend
//   //     const response = await fetch('http://localhost:8080/api/auth/signup', {
//   //       method: 'POST',
//   //       body: formData, // FormData handles multipart/form-data
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(await response.text());
//   //     }

//   //     // Redirect on success
//   //     router.push('/dashboard');
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err.message : 'Signup failed');
//   //   }
//   // };
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   const formData = new FormData();
//   formData.append('email', email);
//   formData.append('password', password);
  
//   // Only append if file exists
//   if (photo) {
//     formData.append('profile_image', photo); // Match backend expectation
//   }

//   try {
//     const response = await fetch('http://localhost:8080/api/auth/signup', {
//       method: 'POST',
//       body: formData,
//       // Let browser set Content-Type with boundary
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Signup failed');
//     }
    
//     router.push('/dashboard');
//   } catch (err) {
//     setError(err instanceof Error ? err.message : 'Signup failed');
//   }
// };
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="id" className="block text-sm font-medium text-gray-700">
//             Password
//             </label>
//             <input
//               type="text"
//               id="id"
//               value={id}
//               onChange={(e) => setId(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
//               Profile Photo (Optional)
//             </label>
//             <input
//               type="file"
//               id="photo"
//               onChange={(e) => setPhoto(e.target.files?.[0] || null)}
//               accept="image/*"
//               className="w-full px-3 py-2 mt-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {error && <div className="text-red-500">{error}</div>}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function SignupPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);
    
//     if (photo) {
//       formData.append('profile_image', photo); // Must match backend field name
//     }

//     try {
//       const response = await fetch('http://localhost:8080/api/auth/signup', {
//         method: 'POST',
//         body: formData,
//         // Don't set Content-Type header - browser will set it automatically
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Signup failed');
//       }

//       router.push('/login');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Signup failed');
//       console.error('Signup error:', err);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength={6}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
//               Profile Photo (Optional)
//             </label>
//             <input
//               type="file"
//               id="photo"
//               onChange={(e) => setPhoto(e.target.files?.[0] || null)}
//               accept="image/*"
//               className="w-full px-3 py-2 mt-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {error && (
//             <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}