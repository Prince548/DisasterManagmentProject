const locations = {
  provinces: [
    {
      name: 'Uttar Pradesh',
      districts: [
        {
          name: 'Lucknow',
          cities: [
            'Aliganj',
            'Aminabad',
            'Chowk',
            'Gomti Nagar',
            'Hazratganj',
            'Indira Nagar',
            'Jankipuram',
            'Rajajipuram',
            'Vikas Nagar',
            'Alambagh',
            'Mahanagar',
            'Chinhat',
            'Krishna Nagar',
            'Ashiyana',
          ],
        },
        {
          name: 'Kanpur Nagar',
          cities: [
            'Swaroop Nagar',
            'Kalyanpur',
            'Govind Nagar',
            'Panki',
            'Ratan Lal Nagar',
            'Civil Lines',
            'Nawabganj',
            'Shyam Nagar',
            'Vikas Nagar',
            'Rawatpur',
          ],
        },
        {
          name: 'Varanasi',
          cities: [
            'Bhelupur',
            'Sigra',
            'Lahurabir',
            'Mahmoorganj',
            'Godowlia',
            'Dashashwamedh',
            'Chetganj',
            'Orderly Bazaar',
            'Rathyatra',
            'Chowk',
          ],
        },
        {
          name: 'Prayagraj',
          cities: [
            'Civil Lines',
            'George Town',
            'Kareli',
            'Daraganj',
            'Naini',
            'Jhunsi',
            'Lukarganj',
            'Chowk',
            'Katra',
          ],
        },
        {
          name: 'Ghaziabad',
          cities: [
            'Vaishali',
            'Indirapuram',
            'Kaushambi',
            'Raj Nagar',
            'Vasundhara',
            'Loni',
            'Modinagar',
            'Crossings Republik',
          ],
        },
        {
          name: 'Noida (Gautam Buddha Nagar)',
          cities: [
            'Sector 18',
            'Sector 62',
            'Sector 137',
            'Sector 15',
            'Sector 50',
            'Greater Noida',
            'Jewar',
            'Dadri',
          ],
        },
        {
          name: 'Meerut',
          cities: [
            'Shastri Nagar',
            'Ganga Nagar',
            'Abu Lane',
            'Pallavpuram',
            'Kanker Khera',
            'Jagrati Vihar',
            'Sadar Bazaar',
            'Lisari Gate',
          ],
        },
        {
          name: 'Agra',
          cities: [
            'Tajganj',
            'Sadar Bazaar',
            'Civil Lines',
            'Dayalbagh',
            'Kamla Nagar',
            'Trans Yamuna Colony',
            'Sikandra',
            'Fatehabad Road',
          ],
        },
        {
          name: 'Gorakhpur',
          cities: [
            'Civil Lines',
            'Golghar',
            'Basharatpur',
            'Taramandal',
            'Rustampur',
            'Rajendra Nagar',
            'Sahjanwa',
            'Chargawan',
            'Khorabar',
            'Kunraghat',
          ],
        },
      ],
    },
  ],
};

const allCities = locations.provinces.flatMap((province) =>
  province.districts.flatMap((district) => district.cities)
);

export { locations, allCities };
