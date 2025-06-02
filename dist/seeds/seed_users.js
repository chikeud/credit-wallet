export async function seed(knex) {
    const trx = await knex.transaction();
    try {
        await trx('identities').delete();
        await trx('identities').insert([
            {
                id: 1507,
                applicant: JSON.stringify({ firstname: "Bunch", lastname: "Dillon" }),
                summary: JSON.stringify({
                    bvn_check: {
                        status: "EXACT_MATCH",
                        fieldMatches: { firstname: true, lastname: true }
                    }
                }),
                status: JSON.stringify({ state: "complete", status: "verified" }),
                bvn: JSON.stringify({
                    bvn: "95888168924",
                    firstname: "Bunch",
                    lastname: "Dillon",
                    birthdate: "07-07-1995",
                    gender: "Male",
                    phone: "08000000000",
                    photo: "/9j/4AAQSkZJRgABAgAAAQABAAD/***/wCpiNUFoooEf//Z"
                })
            },
            {
                id: 1508,
                applicant: JSON.stringify({ firstname: "Alice", lastname: "Johnson" }),
                summary: JSON.stringify({
                    bvn_check: {
                        status: "NO_MATCH",
                        fieldMatches: { firstname: false, lastname: false }
                    }
                }),
                status: JSON.stringify({ state: "pending", status: "unverified" }),
                bvn: JSON.stringify({
                    bvn: "84736291847",
                    firstname: "Alice",
                    lastname: "Johnson",
                    birthdate: "12-05-1988",
                    gender: "Female",
                    phone: "08011112222",
                    photo: "/9j/4AAQSkZJRgABAQEASABIAAD/***/Z"
                })
            },
            {
                id: 1509,
                applicant: JSON.stringify({ firstname: "Carlos", lastname: "Smith" }),
                summary: JSON.stringify({
                    bvn_check: {
                        status: "PARTIAL_MATCH",
                        fieldMatches: { firstname: true, lastname: false }
                    }
                }),
                status: JSON.stringify({ state: "review", status: "pending" }),
                bvn: JSON.stringify({
                    bvn: "93847561029",
                    firstname: "Carlos",
                    lastname: "Smith",
                    birthdate: "23-11-1990",
                    gender: "Male",
                    phone: "08022223333",
                    photo: "/9j/4AAQSkZJRgABAgAAAQABAAD/***/abcEf//Z"
                })
            },
            {
                id: 1510,
                applicant: JSON.stringify({ firstname: "Diana", lastname: "Brown" }),
                summary: JSON.stringify({
                    bvn_check: {
                        status: "EXACT_MATCH",
                        fieldMatches: { firstname: true, lastname: true }
                    }
                }),
                status: JSON.stringify({ state: "complete", status: "verified" }),
                bvn: JSON.stringify({
                    bvn: "10293847566",
                    firstname: "Diana",
                    lastname: "Brown",
                    birthdate: "15-03-1992",
                    gender: "Female",
                    phone: "08033334444",
                    photo: "/9j/4AAQSkZJRgABAQEASABIAAD/***/xyzEf//Z"
                })
            },
            {
                id: 1511,
                applicant: JSON.stringify({ firstname: "Ethan", lastname: "Williams" }),
                summary: JSON.stringify({
                    bvn_check: {
                        status: "NO_MATCH",
                        fieldMatches: { firstname: false, lastname: false }
                    }
                }),
                status: JSON.stringify({ state: "failed", status: "rejected" }),
                bvn: JSON.stringify({
                    bvn: "56473829102",
                    firstname: "Ethan",
                    lastname: "Williams",
                    birthdate: "30-08-1985",
                    gender: "Male",
                    phone: "08044445555",
                    photo: "/9j/4AAQSkZJRgABAQEASABIAAD/***/efgEf//Z"
                })
            }
        ]);
        await trx.commit();
        console.log('Seeding completed successfully.');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        await trx.rollback();
        throw error;
    }
}
