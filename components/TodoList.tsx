"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";

const TodoList = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  return (
    // Calender
    <div className="">
      <h1 className="text-lg font-medium">Todo List </h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
      <ScrollArea className="max-h-[400px] overflow-y-auto">
        <div className="">
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 items-center">
                <Checkbox id="item1" checked />
                <label htmlFor="item1" className="tex-sm text-muted-foreground">
                  Lorem ipsum, dolor sit amet consect isicing.
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TodoList;
