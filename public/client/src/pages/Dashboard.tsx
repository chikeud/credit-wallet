import React, { useEffect, useState } from 'react';

type BvnData = {
    bvn: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
    phone: string;
    photo: string;
};

type StatusData = {
    state: string;
    status: string;
};

type KycResponse = {
    bvn: BvnData;
    verified: StatusData;
};

export default function Dashboard() {
    const [kyc, setKyc] = useState<KycResponse | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/kyc/verify', {
            headers: {
                Authorization: 'Bearer-1510', // Replace with your token logic
            },
        })
            .then((res) => res.json())
            .then((data: KycResponse) => {
                console.log('KYC data:', data);
                setKyc(data);
            })
            .catch((err) => console.error('Failed to fetch KYC data:', err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Client KYC Dashboard</h1>

            {kyc ? (
                <div className="mt-4 bg-white shadow-md rounded-xl p-6 w-full max-w-xl space-y-3">
                    <p><strong>Full Name:</strong> {kyc.bvn.firstname} {kyc.bvn.lastname}</p>
                    <p><strong>BVN:</strong> {kyc.bvn.bvn}</p>
                    <p><strong>Date of Birth:</strong> {kyc.bvn.birthdate}</p>
                    <p><strong>Phone:</strong> {kyc.bvn.phone}</p>
                    <p><strong>Gender:</strong> {kyc.bvn.gender}</p>
                    <p>
                        <strong>Verification:</strong>{' '}
                        <span className={`font-semibold ${kyc.verified.status === 'complete' ? 'text-green-600' : 'text-red-600'}`}>
              {kyc.verified.status === 'complete' ? 'Verified' : 'Unverified'}
            </span>
                    </p>
                    <p><strong>State:</strong> {kyc.verified.state}</p>
                </div>
            ) : (
                <p className="mt-4">Loading KYC data...</p>
            )}
        </div>
    );
}
