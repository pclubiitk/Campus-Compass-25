"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Accordion } from "@/components/ui/accordion";
import NoticeCard from "../components/user/noticeboard/NoticeCard";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DatePicker } from "../components/user/noticeboard/DatePicker";
import Pagination from "../components/user/noticeboard/pagination";
import { Notice } from "../lib/types";
import { ThemeDD } from "../components/ThemeDD";
import BottomNav from "../components/bottomnav";

export default function NoticeList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [openItem, setOpenItem] = useState("");

  const [dateStart, setDateStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    return d;
  });
  const [openStart, setOpenStart] = useState(false);

  const [dateEnd, setDateEnd] = useState(() => new Date());
  const [openEnd, setOpenEnd] = useState(false);

  const currentPage = Number(searchParams?.get("page")) || 1;
  const rawStart = searchParams.get("start");
  const rawEnd = searchParams.get("end");

  // Set dates from URL if present
  useEffect(() => {
    if (rawStart) setDateStart(new Date(rawStart));
    if (rawEnd) setDateEnd(new Date(rawEnd));
  }, [rawStart, rawEnd]);

  // Update URL params on date change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (dateStart && dateEnd) {
      params.set("start", dateStart.toISOString().split("T")[0]);
      params.set("end", dateEnd.toISOString().split("T")[0]);
    }
    params.set("page", currentPage.toString());
    router.push(`?${params.toString()}`);
  }, [dateStart, dateEnd]);

  // Clear URL hash when no accordion item is open
  useEffect(() => {
    if (!openItem) {
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState(null, "", url.toString());
    }
  }, [openItem]);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      const origin = process.env.NEXT_PUBLIC_ORIGIN;
      const params = new URLSearchParams({ page: currentPage.toString() });

      if (dateStart && dateEnd) {
        params.set("start", dateStart.toISOString().split("T")[0]);
        params.set("end", dateEnd.toISOString().split("T")[0]);
      }

      const res = await fetch(`${origin}/api/maps/notice?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setTotalPages(Math.ceil(data.total/data.page_size));
      setNotices(data.noticeboard_list);
      console.log(data)
    };

    fetchNotices();
  }, [currentPage, dateStart, dateEnd]);

  return (
    <>
      <ThemeDD />

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Label>Start Date:</Label>
          <DatePicker open={openStart} setOpen={setOpenStart} setDate={setDateStart} date={dateStart} />
        </div>
        <div className="flex items-center gap-2">
          <Label>End Date:</Label>
          <DatePicker open={openEnd} setOpen={setOpenEnd} setDate={setDateEnd} date={dateEnd} />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {notices.map((notice:Notice,index) => (
          <NoticeCard
            key={notice.ID||index}
            id={String(notice.ID)}
            cardTitle={notice.title}
            cardDescription={notice.card_description}
            noticePreview={notice.preview}
            description={notice.description}
            date={notice.CreatedAt || new Date()}
            location={notice.locationInfo}
            publisher={notice.User.name}
          />
        ))}
      </Accordion>

      <div className="mt-5 flex flex-col w-full justify-center items-center pb-15">
        <Pagination totalPages={totalPages} />
        <BottomNav/>
      </div>
      
    </>
  );
}
