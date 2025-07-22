import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Filter, IndianRupee, MapPin, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs } from '@/app/features/jobSlice';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

const Jobs = () => {
  const allJobs = useSelector((state) => state.jobs.jobs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    category: '',
    keyword: '',
    salary: 0,
  });

  const getAllJobs = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/jobs`);
      dispatch(setJobs(result.data.jobs));
      setFilteredJobs(result.data.jobs);
    } catch (error) {
      console.error("Error loading jobs", error);
    }
  };

  const parseSalaryRange = (salaryStr) => {
    if (!salaryStr) return { min: 0, max: 0 };
    const [minStr] = salaryStr.replace(' LPA', '').split('-');
    return {
      min: parseFloat(minStr),
    };
  };

  const applyFilters = () => {
    const filtered = allJobs.filter((job) => {
      const matchesKeyword = filters.keyword
        ? job.jobTitle.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.Details.company.toLowerCase().includes(filters.keyword.toLowerCase())
        : true;

      const matchesLocation = filters.location
        ? job.Details.location === filters.location
        : true;

      const matchesJobType = filters.jobType
        ? job.Details.jobType === filters.jobType
        : true;

      const matchesCategory = filters.category
        ? job.Details.category === filters.category
        : true;

      const matchesSalary = filters.salary
        ? (() => {
          const { min } = parseSalaryRange(job.Details.salary);
          return min >= filters.salary;
        })()
        : true;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesJobType &&
        matchesCategory &&
        matchesSalary
      );
    });

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <div className='max-w-6xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8'>
      <div className="flex items-center justify-between py-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Find Jobs</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 text-sm">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
              <SheetDescription>Use the filters below to narrow your job search.</SheetDescription>
            </SheetHeader>
            <div className="px-4 py-2 overflow-y-auto max-h-[70vh]">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g. Software Engineer"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                />
              </div>

              <Separator className='my-4' />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <RadioGroup
                  value={filters.location}
                  onValueChange={(value) => setFilters({ ...filters, location: value })}
                  className="flex flex-col gap-2"
                >
                  <RadioGroupItem value="" id="loc-all" />
                  <label htmlFor="loc-all">All</label>
                  {["Bangalore", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida", "Remote", "Mumbai", "Kolkata", "Ahmedabad"].map((loc) => (
                    <div className="flex items-center gap-2" key={loc}>
                      <RadioGroupItem value={loc} id={loc} />
                      <label htmlFor={loc}>{loc}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Job Type</label>
                <RadioGroup
                  value={filters.jobType}
                  onValueChange={(value) => setFilters({ ...filters, jobType: value })}
                  className="flex flex-col gap-2"
                >
                  {["All", "Full-Time", "Part-Time", "Internship", "Freelance", "Remote"].map((type) => (
                    <div className="flex items-center gap-2" key={type}>
                      <RadioGroupItem value={type === "All" ? "" : type} id={type} />
                      <label htmlFor={type}>{type}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Job Category</label>
                <RadioGroup
                  value={filters.category}
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                  className="flex flex-col gap-2"
                >
                  {[
                    { label: "All", value: "" },
                    { label: "Frontend Development", value: "frontend" },
                    { label: "Backend Development", value: "backend" },
                    { label: "Full Stack", value: "full-stack" },
                    { label: "DevOps", value: "devops" },
                    { label: "Data Science", value: "datascience" },
                    { label: "UI/UX Design", value: "uiux" },
                    { label: "QA / Testing", value: "qa" },
                    { label: "AI / ML", value: "ai-ml" },
                    { label: "Mobile Development", value: "mobile" },
                    { label: "Cybersecurity", value: "cybersecurity" },
                    { label: "Cloud / AWS / GCP", value: "cloud" }
                  ].map(({ label, value }) => (
                    <div className="flex gap-2 items-center" key={value}>
                      <RadioGroupItem value={value} id={value || "cat-any"} />
                      <label htmlFor={value || "cat-any"}>{label}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Minimum Salary (LPA)</label>
                <Slider
                  value={[filters.salary]}
                  onValueChange={(value) => setFilters({ ...filters, salary: value[0] })}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs mt-1 text-gray-600 pt-1">{filters.salary} LPA or more</p>
              </div>
            </div>
            <SheetFooter className="flex justify-between mt-4">
              <SheetClose asChild>
                <Button onClick={applyFilters}>Apply</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ location: "", jobType: "", category: "", keyword: "", salary: 0 });
                    setFilteredJobs(allJobs);
                  }}
                >
                  Clear All
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job._id} className='border border-gray-300 bg-gray-100'>
            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
              <div className="flex gap-3 items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={job.Details.image} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base sm:text-lg">
                    {job.jobTitle}
                    <span className='ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-200 text-gray-700'>
                      {job.Details.jobType}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.Details.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" /> {job.Details.salary}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate(`/jobs/${job._id}`)} className="w-full sm:w-auto">
                Apply Now <MoveRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
