import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Twitter from '@/components/Twitter';
import Chart from '@/components/Chart';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import mockAxios from 'axios';

let wrapper;
let store;
let actions;
let mutations;
let state;
const localVue = createLocalVue();
localVue.use(Vuex);

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
});

beforeEach(() => {
  mutations = {
    updateLoaded: jest.fn(),
  };

  state = {
    loaded: true,
  };

  store = new Vuex.Store({
    actions,
    mutations,
    state,
  });

  wrapper = shallowMount(Twitter, {
    propsData: {},
    mocks: {},
    stubs: {},
    methods: {},
    store,
    localVue,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('Twitter.vue', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it('should render correct logo', () => {
    expect(wrapper.vm.$el.querySelector('img').getAttribute('src'))
      .toEqual('../assets/twitter_logo.png');
  });

  it('should contain date picker', () => {
    expect(wrapper.contains(DatePicker))
      .toBe(true);
  });

  it('should contain line chart', () => {
    expect(wrapper.contains(Chart))
      .toBe(true);
  });

  it('should contain the correct number of datasets', () => {
    expect(wrapper.vm.chartdata.datasets.length)
      .toBe(4);
  });

  it('should contain the correct dataset labels', () => {
    const labels = ['Elon Musk',
      'Donald Trump',
      'Barack Obama',
      'The Economist'];

    wrapper.vm.chartdata.datasets.forEach((dataset) => {
      expect(labels.includes(dataset.label))
        .toBeTruthy();
    });
  });

  it('should call API endpoint with default params', async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({ data: [{ elonmusk: { N: '0' }, TheEconomist: { N: '0' }, id: { N: '1577268000' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '7' }, TheEconomist: { N: '5' }, id: { N: '1577656800' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '1' }, TheEconomist: { N: '3' }, id: { N: '1577397600' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '0' }, TheEconomist: { N: '3' }, id: { N: '1577523600' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }] }),
    );

    await wrapper.vm.storeMetrics();

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://fl2pqtejz0.execute-api.us-east-1.amazonaws.com/prod/metrics',
      { params: { start: 0, end: 9999999999 } },
    );
  });

  it('should call API endpoint with custom params', async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({ data: [{ elonmusk: { N: '0' }, TheEconomist: { N: '0' }, id: { N: '1577268000' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '7' }, TheEconomist: { N: '5' }, id: { N: '1577656800' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '1' }, TheEconomist: { N: '3' }, id: { N: '1577397600' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }, { elonmusk: { N: '0' }, TheEconomist: { N: '3' }, id: { N: '1577523600' }, BarackObama: { N: '0' }, realDonaldTrump: { N: '0' } }] }),
    );

    state = {
      dateRange: {
        start: 0,
        end: 1577588400,
      },
    };

    store = new Vuex.Store({ actions, mutations, state });

    wrapper = shallowMount(Twitter, {
      propsData: {},
      mocks: {},
      stubs: {},
      methods: {},
      store,
      localVue,
    });

    await wrapper.vm.storeMetrics();

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://fl2pqtejz0.execute-api.us-east-1.amazonaws.com/prod/metrics',
      { params: { start: 0, end: 1577588 } },
    );
  });
});
