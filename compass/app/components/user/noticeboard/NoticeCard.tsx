"use client"

import { Calendar, MapPin, User } from "lucide-react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NoticeCard({
  id,
  publisher,
  date,
  location,
  cardTitle,
  cardDescription,
  noticePreview,
  description,
}: {
  id: string;
  publisher: string;
  date: string | Date;
  location: string;
  cardTitle: string;
  cardDescription: string;
  noticePreview: string;
  description: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <AccordionItem id={id} value={id} className="border-0">
      <Card className="overflow-hidden shadow-md rounded-2xl border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold">{cardTitle}</CardTitle>
          <CardDescription className="text-muted-foreground">{cardDescription}</CardDescription>
        </CardHeader>

        <CardContent className="pb-4 space-y-4 text-sm">
          <p className="text-base">{noticePreview}</p>

          <div className="flex justify-between">
            <div className="flex p-1.5 rounded-full bg-[#8100ffad] items-center gap-2">
              <User className="w-4 h-4" />
              <span className="truncate">{publisher}</span>
            </div>
            <div className="flex p-1.5 rounded-full bg-[#8100ffad] items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex p-1.5 rounded-full bg-[#8100ffad]  items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>

          <div
            onClick={() => {
              const url = new URL(window.location.href);
              if (window.location.hash.substring(1) !== id) {
                url.hash = id;
                window.history.replaceState(null, "", url.toString());
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              } else {
                url.hash = "";
                window.history.replaceState(null, "", url.toString());
              }
            }}
            className="w-max"
          >
            <AccordionTrigger className="font-medium">
              Read More
            </AccordionTrigger>
          </div>

          <AccordionContent className="pt-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </AccordionContent>
        </CardContent>
      </Card>
    </AccordionItem>
  );
}
