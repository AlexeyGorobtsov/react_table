import cassification from './classification';

export default [
    {
        id: 'name',
        label: 'Name',
        show: true,
        sample: '$2 chuck',
        align: 'left',
    },
    {
        id: 'year',
        label: 'Year',
        type: 'year',
        show: true,
        sample: 2015,
    },
    {
        id: 'grape',
        label: 'Grape',
        type: 'suggest',
        options: cassification.grapes,
        show: true,
        sample: 'Merlot',
        align: 'left',
    },
    {
        id: 'comments',
        label: 'Comments',
        type: 'text',
        sample: 'Nice for the price',
    }

];