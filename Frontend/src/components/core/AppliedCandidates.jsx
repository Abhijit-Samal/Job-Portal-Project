import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const jobsArray = useSelector((state) => state.jobs.jobs);

  // Find the job by jobId
  const job = jobsArray.find((job) => job._id === jobId);

  if (!job) {
    return (
      <div className="text-center text-muted-foreground text-lg mt-10">
        Job not found.
      </div>
    );
  }

  const appliedUsers = job.appliedUsers || [];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">
        Candidates Applied for: {job.jobTitle}
      </h2>

      {appliedUsers.length === 0 ? (
        <div className="text-muted-foreground mt-4">No one has applied yet.</div>
      ) : (
        appliedUsers.map((app, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={app.user?.image} />
                <AvatarFallback>
                  {app.user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{app.user?.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {app.user?.email} • {app.user?.phone}
                </p>
              </div>
              <a
                href={app.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Resume
              </a>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default AppliedCandidates;
