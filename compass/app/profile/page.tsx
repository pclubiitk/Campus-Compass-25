'use client'
import Image from "next/image";
import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Star } from 'lucide-react';

// }
interface UserProfile {
  user: {
    email: string;
    profile_image: string;
  };
  contribution: {
    review: string;
    rating: number;
    spot_id: string;
    image_url: string | null;
  } | null;
  spot: {
    description: string;
    rating: number;
    image_url: string | null;
  } | null;
  locations: {
    id: string;
    location_type: string;
    latitude: number;
    longitude: number;
  }[];
}

const StarFilled = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007..." clipRule="evenodd" />
  </svg>
);

const StarEmpty = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111..." />
  </svg>
);

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationUrl, setLocationUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/1`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const shareLocation = () => {
    setStatus('Getting your location...');
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const mapUrl = `https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}#map=15/${coords.latitude}/${coords.longitude}`;
        setLocationUrl(mapUrl);
        setStatus('Location retrieved!');
      },
      () => setStatus('Unable to retrieve your location.')
    );
  };

  const shareViaNative = async () => {
    if (!locationUrl) return alert('No location URL!');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: 'Check this out!',
          url: locationUrl,
        });
        alert('Shared successfully!');
      } catch (error) {
        alert('Sharing failed.');
      }
    } else {
      alert('Web Share not supported.');
    }
  };

  return (
    <div className="min-h-screen p-4 pb-16 sm:p-8 sm:pb-20 font-sans bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-8 sm:gap-10 items-center w-full mx-auto max-w-4xl">

        {/* Profile Section */}
        <div className="w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
              {loading ? (
                <div className="bg-gray-200 dark:bg-gray-700 w-full h-full animate-pulse"></div>
              ) : (
                <Image
                  src={profile?.user.profile_image || "/fallback.png"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? 'Loading...' : profile?.user.email}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Community Member
              </p>
            </div>
          </div>
        </div>
       
        {/* Contribution Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
      <StarFilled className="w-5 h-5 text-yellow-300" />
      <span>Community Contribution</span>
    </h3>
  </div>
        <section className="w-full space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
{profile?.contribution ? (
  <div>
    <p>Review: {profile.contribution.review}</p>
    <br></br>
    
    {profile.contribution.image_url && (
      <img src={profile.contribution.image_url} alt="Contribution Spot" width={200} />
    )}
    <br></br>
    <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= (profile.contribution?.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-500'
                    }`}
                    fill={star <= (profile.contribution?.rating || 0) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {profile.contribution.rating}/5
                </span>
              </div>
    
  </div>
) : (
  <p>No contributions yet.</p>
)}

{/* {profile?.spot ? (
  <div>
    <p>Description: {profile.spot.description}</p>
    <p>Rating: {profile.spot.rating}</p>
    {profile.spot.image_url && (
      <img src={profile.spot.image_url} alt="Favorite Spot" width={200} />
    )}
  </div>
) : (
  <p>No favorite spot added.</p>
)} */}
        </section>

        {/* Starred Spot Section */}
        {/* <section className="w-full space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Favourite Spot
          </h2>
          {loading ? (
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ) : (
            <Card className="w-full max-w-xs sm:max-w-sm mx-auto bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800 dark:text-white">
                  {profile?.spot.description}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  You rated this spot:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) =>
                    <span key={star}>
                      {star <= (profile?.spot.rating || 0) ? (
                        <StarFilled className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <StarEmpty className="w-6 h-6 text-gray-300 dark:text-gray-500" />
                      )}
                    </span>
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {profile?.spot.rating}/5
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </section> */}

         {/* Favourite Spot Section */}
      <section className="w-full space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Favourite Spot
        </h2>

        {loading ? (
          <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        ) : profile?.spot ? (
          <Card className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-gray-800 dark:text-white">
                {profile.spot.description}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                You rated this spot:
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {profile.spot.image_url && (
  <Image 
    src={profile.spot.image_url}
    alt="Spot image"
    width={300}
    height={200}
    className="mt-4 rounded-lg"
  />
)}
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= (profile.spot?.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-500'
                    }`}
                    fill={star <= (profile.spot?.rating || 0) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {profile.spot.rating}/5
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No favourite spot added.</p>
        )}
      </section>

        {/* Location Sharing */}
        <section className="w-full max-w-md space-y-4 mt-6">
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={shareLocation}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share My Location
            </Button>
            {status && (
              <p className={`text-sm ${status.includes('retrieved') ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {status}
              </p>
            )}
          </div>
          
          {locationUrl && (
            <div className="space-y-3">
              <div className="flex gap-2 w-full">
                <input 
                  className="flex-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm" 
                  value={locationUrl} 
                  readOnly 
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => { navigator.clipboard.writeText(locationUrl); }}
                  variant="outline"
                  className="flex-1"
                >
                  Copy Link
                </Button>
                <Button 
                  onClick={shareViaNative}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Share via...
                </Button>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}