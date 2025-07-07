"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { X, Share2, Heart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { FacebookShareButton, FacebookIcon, RedditShareButton, RedditIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon } from "next-share";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ReviewCard from "@/app/components/user/ReviewCard";

export default function LocationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const router = useRouter();

  const [location, setLocation] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/maps/location/${id}`);
        const data = await res.json();
        setLocation(data.location);
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/maps/reviews/${id}/${page}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchLocation();
    fetchReviews();
  }, [id, page]);

  if (!id || !location) {
    return <p className="text-center p-4">Loading location...</p>;
  }

  const rating = location.avg_rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="a">
      <div className="p-0 w-full max-w-md mx-auto my-0 pb-0">
        <Image
          src="https://www.iitk.ac.in/hall11/img/portfolio/02-large.jpg"
          alt="image"
          width={500}
          height={300}
          className="r"
        />
      </div>

      <Card className="w-full max-w-md mx-auto bg-white ">
        <div className="absolute top-2 left-0 right-0 mx-auto w-fit flex justify-between">
          <X
            className="w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200 hover:text-red-500"
            onClick={() => router.back()}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200 hover:text-red-500">
                <Share2 />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Social Share</AlertDialogTitle>
                <div className="flex justify-center gap-4 mt-2">
                  <FacebookShareButton url={typeof window !== "undefined" ? window.location.href : ""}>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  <RedditShareButton url={typeof window !== "undefined" ? window.location.href : ""}>
                    <RedditIcon size={40} round />
                  </RedditShareButton>
                  <WhatsappShareButton url={typeof window !== "undefined" ? window.location.href : ""}>
                    <WhatsappIcon size={40} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton url={typeof window !== "undefined" ? window.location.href : ""}>
                    <LinkedinIcon size={40} round />
                  </LinkedinShareButton>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Heart className="w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200 hover:text-red-500" />
        </div>

        <CardHeader>
          <div className="flex content-center ">
            <p className="text-2xl">
              <b className="text-black">{location.name}</b>
            </p>
          </div>

          <div className="flex">
            <p className="mr-1 text-black">{rating}/5</p>
            <div className="flex text-[#FFD700]">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} fill="#FFD700" stroke="#FFD700" />
              ))}
              {hasHalfStar && (
                <StarHalf key="half" fill="#FFD700" stroke="#FFD700" />
              )}
            </div>{" "}
            ({location.review_count})
          </div>

          <div className="flex justify-between my-4">
            <div>
              <p className="text-gray-600">{location.tag}</p>
              <p className="text-gray-600">{location.timings}</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <CircleUserRound className="font-semibold mt-2 cursor-pointer text-black" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Phone Number</h4>
                  <p className="text-muted-foreground text-sm">
                    {location.contact}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <CardDescription>
            <p>{location.description}</p>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ScrollArea className="max-w-5xl mx-auto border whitespace-nowrap rounded-md">
            <ScrollBar orientation="horizontal" />
            <div className="flex w-max space-x-4 p-4">
              {(location.images || []).map((img: string, i: number) => (
               <Drawer>
                    <DrawerTrigger asChild>
                      <div className="relative cursor-pointer w-[300px] h-[200px]">
                        <Image src={img} alt={`Image ${i}`} fill className="rounded-md object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition rounded-md" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="h-screen p-0 overflow-hidden">
                      <DrawerHeader>
                        <DrawerClose asChild className="text-black bg-white hover:bg-white/50 p-2 rounded-full m-auto">
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                        <DrawerTitle>
                          <Image src={img} alt={`Image ${i}`} fill className="object-contain bg-black m-auto" />
                        </DrawerTitle>
                        <DrawerDescription className="text-center text-white">
                          This is a photo description.
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter />
                    </DrawerContent>
                  </Drawer>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-32 mx-auto">
              Add Review
            </button>
          </DrawerTrigger>
          <p className="mx-5">
            <b className="text-black">Review summary</b>
          </p>

          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Help Others by giving review</DrawerTitle>

              <form className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="rating">
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    aria-label="1 star"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    aria-label="2 star"
                    defaultChecked
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    aria-label="3 star"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    aria-label="4 star"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    aria-label="5 star"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your experience..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600"
                  />
                </div>

      
                <AlertDialog>
                  <AlertDialogTrigger className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition">
                    Submit Review
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will add a review
                        with your name to this place.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Done</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>

              <DrawerDescription className="mt-4 text-sm text-gray-500">
             
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <CardFooter>
          {reviews?.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  author={review.contributedBy}
                  rating={review.rating}
                  review_body={review.discription}
                  time={review.CreatedAt}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500 italic">No reviews yet.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}



// just for testing purposes, remove later

// "use client";

// import { useRouter } from "next/navigation";
// import { X, Share2, CircleUserRound, Star, StarHalf, Heart } from "lucide-react";
// import Image from "next/image";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import ReviewCard from "@/app/components/user/ReviewCard";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   FacebookShareButton,
//   FacebookIcon,
//   RedditShareButton,
//   RedditIcon,
//   WhatsappShareButton,
//   WhatsappIcon,
//   LinkedinShareButton,
//   LinkedinIcon,
// } from "next-share";

// //  Dummy Data
// const locationData = {
//   name: "IITK Hall 11",
//   avg_rating: 4.3,
//   ReviewCount: 7,
//   ratting: 4.3,
//   tag: "Hostel | Boys | IITK",
//   timings: "Open 24 hours",
//   discription: "One of the premier halls in IIT Kanpur with excellent facilities and great vibe.",
//   contact: "+91 9876543210",
//   images: [
//     { link: "https://www.iitk.ac.in/hall11/img/portfolio/02-large.jpg" },
//     { link: "https://www.iitk.ac.in/hall11/img/portfolio/03-large.jpg" },
//     { link: "https://www.iitk.ac.in/hall11/img/portfolio/04-large.jpg" },
//   ],
// };

// const locationReviews = [
//   {
//     User: { name: "Muragesh" },
//     rating: 5,
//     discription: "Amazing experience! Super clean and quiet environment.",
//   },
//   {
//     User: { name: "Ravi" },
//     rating: 4,
//     discription: "Nice place to stay, very spacious rooms.",
//   },
//   {
//     User: { name: "Priya" },
//     rating: 3.5,
//     discription: "Average food but great ambiance.",
//   },
// ];


// const rating = locationData.ratting;
// const fullStars = Math.floor(rating);
// const hasHalfStar = rating % 1 >= 0.5;

// export default function LocationPage() {
//   const router = useRouter();

//   return (
//     <div className="a">
//       <div className="p-0 w-full max-w-md mx-auto my-0 pb-0">
//         <Image
//           src={locationData.images[0].link}
//           alt="cover image"
//           width={500}
//           height={300}
//           className="r"
//         />
//       </div>

//       <Card className="w-full max-w-md mx-auto bg-white">
//         <div className="absolute top-2 left-0 right-0 mx-auto w-fit flex justify-between">
//           <X className="w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200 hover:text-red-500" onClick={() => router.back()} />
          
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <button className="w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200 hover:text-red-500">
//                 <Share2 />
//               </button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Social Share</AlertDialogTitle>
//                 <div className="p-2 text-center">
//                   <div className="flex justify-center gap-4 mt-2">
//                     <FacebookShareButton url="https://localhost:3000">
//                       <FacebookIcon size={40} round />
//                     </FacebookShareButton>
//                     <RedditShareButton url="https://localhost:3000">
//                       <RedditIcon size={40} round />
//                     </RedditShareButton>
//                     <WhatsappShareButton url="https://localhost:3000">
//                       <WhatsappIcon size={40} round />
//                     </WhatsappShareButton>
//                     <LinkedinShareButton url="https://localhost:3000">
//                       <LinkedinIcon size={40} round />
//                     </LinkedinShareButton>
//                   </div>
//                 </div>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Close</AlertDialogCancel>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>

//           <Heart className="hover:text-red-500 w-7 h-7 m-1 mx-10 p-1 rounded-full bg-cyan-50 text-black cursor-pointer hover:bg-cyan-200" />
//         </div>

//         <CardHeader>
//           <p className="text-2xl font-bold text-black">{locationData.name}</p>

//           <div className="flex">
//             <p className="mr-1 text-black">{locationData.avg_rating}/5</p>
//             <div className="flex text-[#FFD700]">
//               {[...Array(fullStars)].map((_, i) => (
//                 <Star key={`full-${i}`} fill="#FFD700" stroke="#FFD700" />
//               ))}
//               {hasHalfStar && <StarHalf key="half" fill="#FFD700" stroke="#FFD700" />}
//             </div>{" "}
//             ({locationData.ReviewCount})
//           </div>

//           <div className="flex justify-between my-4">
//             <div>
//               <p className="text-gray-600">{locationData.tag}</p>
//               <p className="text-gray-600">{locationData.timings}</p>
//             </div>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <CircleUserRound className="mt-2 cursor-pointer text-black" />
//               </PopoverTrigger>
//               <PopoverContent className="w-80">
//                 <h4 className="font-medium">Phone Number</h4>
//                 <p className="text-sm text-muted-foreground">{locationData.contact}</p>
//               </PopoverContent>
//             </Popover>
//           </div>

//           <CardDescription>{locationData.discription}</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <ScrollArea className="max-w-5xl mx-auto border whitespace-nowrap rounded-md">
//             <ScrollBar orientation="horizontal" />
//             <div className="flex w-max space-x-4 p-4">
//               {locationData.images.map((item, index) => (
//                 <div key={index} className="overflow-hidden rounded-md">
                  // <Drawer>
                  //   <DrawerTrigger asChild>
                  //     <div className="relative cursor-pointer w-[300px] h-[200px]">
                  //       <Image src={item.link} alt={`Image ${index}`} fill className="rounded-md object-cover" />
                  //       <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition rounded-md" />
                  //     </div>
                  //   </DrawerTrigger>
                  //   <DrawerContent className="h-screen p-0 overflow-hidden">
                  //     <DrawerHeader>
                  //       <DrawerClose asChild className="text-black bg-white hover:bg-white/50 p-2 rounded-full m-auto">
                  //         <Button variant="outline">Close</Button>
                  //       </DrawerClose>
                  //       <DrawerTitle>
                  //         <Image src={item.link} alt={`Image ${index}`} fill className="object-contain bg-black m-auto" />
                  //       </DrawerTitle>
                  //       <DrawerDescription className="text-center text-white">
                  //         This is a photo description.
                  //       </DrawerDescription>
                  //     </DrawerHeader>
                  //     <DrawerFooter />
                  //   </DrawerContent>
                  // </Drawer>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </CardContent>

        // <Drawer>
        //   <DrawerTrigger asChild>
        //     <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-32 mx-auto">
        //       Add Review
        //     </button>
        //   </DrawerTrigger>
        //   <p className="mx-5">
        //     <b className="text-black">Review summary</b>
        //   </p>

        //   <DrawerContent>
        //     <DrawerHeader>
        //       <DrawerTitle>Help Others by giving review</DrawerTitle>

        //       <form className="space-y-4 mt-4">
        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1">
        //             Your Name
        //           </label>
        //           <input
        //             type="text"
        //             placeholder="Enter your name"
        //             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        //           />
        //         </div>

        //         <div className="rating">
        //           <input
        //             type="radio"
        //             name="rating-2"
        //             className="mask mask-star-2 bg-orange-400"
        //             aria-label="1 star"
        //           />
        //           <input
        //             type="radio"
        //             name="rating-2"
        //             className="mask mask-star-2 bg-orange-400"
        //             aria-label="2 star"
        //             defaultChecked
        //           />
        //           <input
        //             type="radio"
        //             name="rating-2"
        //             className="mask mask-star-2 bg-orange-400"
        //             aria-label="3 star"
        //           />
        //           <input
        //             type="radio"
        //             name="rating-2"
        //             className="mask mask-star-2 bg-orange-400"
        //             aria-label="4 star"
        //           />
        //           <input
        //             type="radio"
        //             name="rating-2"
        //             className="mask mask-star-2 bg-orange-400"
        //             aria-label="5 star"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1">
        //             Your Review
        //           </label>
        //           <textarea
        //             rows={4}
        //             placeholder="Write your experience..."
        //             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-sm font-medium text-gray-700 mb-1">
        //             Upload Image (optional)
        //           </label>
        //           <input
        //             type="file"
        //             accept="image/*"
        //             className="block w-full text-sm text-gray-600"
        //           />
        //         </div>

      
        //         <AlertDialog>
        //           <AlertDialogTrigger className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition">
        //             Submit Review
        //           </AlertDialogTrigger>
        //           <AlertDialogContent>
        //             <AlertDialogHeader>
        //               <AlertDialogTitle>
        //                 Are you absolutely sure?
        //               </AlertDialogTitle>
        //               <AlertDialogDescription>
        //                 This action cannot be undone. This will add a review
        //                 with your name to this place.
        //               </AlertDialogDescription>
        //             </AlertDialogHeader>
        //             <AlertDialogFooter>
        //               <AlertDialogCancel>Cancel</AlertDialogCancel>
        //               <AlertDialogAction>Done</AlertDialogAction>
        //             </AlertDialogFooter>
        //           </AlertDialogContent>
        //         </AlertDialog>
        //       </form>

        //       <DrawerDescription className="mt-4 text-sm text-gray-500">
             
        //       </DrawerDescription>
        //     </DrawerHeader>
        //     <DrawerFooter>
        //       <DrawerClose asChild>
        //         <Button variant="outline">Cancel</Button>
        //       </DrawerClose>
        //     </DrawerFooter>
        //   </DrawerContent>
        // </Drawer>
//         <CardFooter>
//           {locationReviews.length > 0 ? (
//             <div className="space-y-4">
//               {locationReviews.map((review, index) => (
//                 <ReviewCard
//                   key={index}
//                   author={review.User.name}
//                   rating={review.rating}
//                   review_body={review.discription}
//                 />
//               ))}
//             </div>
//           ) : (
//             <p className="mt-4 text-gray-500 italic">No reviews yet.</p>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
