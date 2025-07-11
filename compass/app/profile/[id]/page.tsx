// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'

// interface UserData {
//   email: string
//   profile_image: string
// }

// interface Contribution {
//   review: string
//   rating: number
//   image_urls: string[]
//   spot_id: number
//   location_type: string
// }

// interface FavoriteSpot {
//   description: string
//   rating: number
//   image_urls: string[]
//   location_type: string
// }

// interface ProfileData {
//   user: UserData
//   contributions: Contribution[]
//   favorite_spots: FavoriteSpot[]
// }

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<ProfileData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         router.push('/login')
//         return
//       }

//       try {
//         const response = await fetch('http://localhost:8080/api/profile/', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           },
//           credentials: 'include'
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data: ProfileData = await response.json()
//         setProfile(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch profile')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [router])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     router.push('/login');
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         Error: {error}
        
//       </div>
//     )
    
//   }

//   if (!profile) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         No profile data available
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
//       <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
//         {/* Profile Header */}
//         <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
//           <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
//             <Image
//             // profile.user.profile_image ||
//               src={ '/31aa0912-603d-43a3-8c62-61c98e1d25dd.png'}
//               alt="Profile"
//               width={128}
//               height={128}
//               className="object-cover w-full h-full"
//               priority
//               unoptimized
//             />
//           </div>
//           <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
//             {profile.user.email}
//           </h1>

          
//             <button 
        
//         className="delete-account-btn"
//         style={{
//           backgroundColor: 'black',
//           color: 'white',
//           padding: '10px 10px',
//           border: 'none',
//           height : '50px',
//           borderRadius: '20px',
//           cursor: 'pointer',
//           marginTop: '20px',
//           marginLeft: '5px',
//           marginBottom : '20px'
//         }}
//       >
//         Sign Out
//       </button>
//         </div>

        

//         {/* Contributions Section */}
//         {profile.contributions?.length > 0 && (
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Reviews</h2>
//             <div className="space-y-6">
//               {profile.contributions.map((contribution, index) => (
//                 <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//                   <h3 className="font-medium text-lg text-gray-900 dark:text-white">
//                     {contribution.location_type}
//                   </h3>
                  
//                   {/* Image Carousel */}
//                   {contribution.image_urls?.length > 0 && (
//                     <div className="relative mt-3">
//                       <div className="w-full overflow-hidden">
//                         <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
//                           {contribution.image_urls.map((imgUrl, imgIndex) => (
//                             <div 
//                               key={imgIndex} 
//                               className="flex-shrink-0 w-full snap-start px-1"
//                             >
//                               <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200">
//                                 <Image
//                                   src={imgUrl}
//                                   alt={`${contribution.location_type} image ${imgIndex + 1}`}
//                                   fill
//                                   className="object-cover"
//                                   unoptimized
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <p className="text-gray-600 dark:text-gray-300 mt-3">
//                     {contribution.review}
//                   </p>
//                   <div className="flex items-center space-x-1 mt-3">
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon key={i} filled={i < contribution.rating} />
//                     ))}
//                     <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
//                       {contribution.rating}/5
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Favorite Spots Section */}
//         {profile.favorite_spots?.length > 0 && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Favorite Spots</h2>
//             <div className="space-y-6">
//               {profile.favorite_spots.map((spot, index) => (
//                 <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//                   <h3 className="font-medium text-lg text-gray-900 dark:text-white">
//                     {spot.location_type}
//                   </h3>
                  
//                   {/* Image Carousel */}
//                   {spot.image_urls?.length > 0 && (
//                     <div className="relative mt-3">
//                       <div className="w-full overflow-hidden">
//                         <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
//                           {spot.image_urls.map((imgUrl, imgIndex) => (
//                             <div 
//                               key={imgIndex} 
//                               className="flex-shrink-0 w-full snap-start px-1"
//                             >
//                               <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200">
//                                 <Image
//                                   src={imgUrl}
//                                   alt={`${spot.location_type} image ${imgIndex + 1}`}
//                                   fill
//                                   className="object-cover"
//                                   unoptimized
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <p className="text-gray-600 dark:text-gray-300 mt-3">
//                     {spot.description}
//                   </p>
//                   <div className="flex items-center space-x-1 mt-3">
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon key={i} filled={i < spot.rating} />
//                     ))}
//                     <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
//                       {spot.rating}/5
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

        

//         {/* Empty State */}
//         {(!profile.contributions?.length && !profile.favorite_spots?.length) && (
//           <div className="p-6 text-center">
//             <p className="text-gray-600 dark:text-gray-400">
//               You haven't made any contributions or added any spots yet.
//             </p>
//           </div>
//         )}

//       </div>
//     </div>
    
//   )
// }

// function StarIcon({ filled }: { filled: boolean }) {
//   return (
//     <svg
//       className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//     </svg>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UserData {
  email: string
  profile_image?: string
}

interface Contribution {
  review: string
  rating: number
  image_urls: string[]
  spot_id: number
  spot_name: string
  location_type: string
}

interface FavoriteSpot {
  description: string
  rating: number
  image_urls: string[]
  location_type: string
}

interface ProfileData {
  user: UserData
  contributions?: Contribution[]
  favorite_spots?: FavoriteSpot[]

}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = params.id 
          ? `http://localhost:8080/api/profile/${params.id}`
          : 'http://localhost:8080/api/profile'
        
        const response = await fetch(url, {
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ProfileData = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.id, router])

  const handleSignOut = () => {
    document.cookie = 'auth_token=; Max-Age=0; path=/; domain=localhost'
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    router.push('/login')
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        No profile data available
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            <Image
              src={profile.user.profile_image || '/default-profile.png'}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              priority
              unoptimized
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {profile.user.email}
          </h1>

          <button 
            onClick={handleSignOut}
            className="delete-account-btn"
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px 10px',
              border: 'none',
              height: '50px',
              borderRadius: '20px',
              cursor: 'pointer',
              marginTop: '20px',
              marginLeft: '5px',
              marginBottom: '20px'
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Contributions Section */}
        {profile.contributions && profile.contributions.length > 0 && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Reviews</h2>
            <div className="space-y-6">
              {profile.contributions.map((contribution, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                    {contribution.spot_name} ({contribution.location_type})
                  </h3>
                  
                  {contribution.image_urls?.length > 0 && (
                    <div className="relative mt-3">
                      <div className="w-full overflow-hidden">
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
                          {contribution.image_urls.map((imgUrl, imgIndex) => (
                            <div 
                              key={imgIndex} 
                              className="flex-shrink-0 w-full snap-start px-1"
                            >
                              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={imgUrl}
                                  alt={`${contribution.spot_name} image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {contribution.review}
                  </p>
                  <div className="flex items-center space-x-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < contribution.rating} />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {contribution.rating}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Spots Section */}
        {profile.favorite_spots && profile.favorite_spots.length > 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Favorite Spots</h2>
            <div className="space-y-6">
              {profile.favorite_spots.map((spot, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                    {spot.location_type}
                  </h3>
                  
                  {spot.image_urls?.length > 0 && (
                    <div className="relative mt-3">
                      <div className="w-full overflow-hidden">
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4">
                          {spot.image_urls.map((imgUrl, imgIndex) => (
                            <div 
                              key={imgIndex} 
                              className="flex-shrink-0 w-full snap-start px-1"
                            >
                              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={imgUrl}
                                  alt={`${spot.location_type} image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {spot.description}
                  </p>
                  <div className="flex items-center space-x-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < spot.rating} />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {spot.rating}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!profile.contributions?.length && !profile.favorite_spots?.length) && (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You haven't made any contributions or added any spots yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}