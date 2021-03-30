import {
  BrokerAsPromised,
  BrokerConfig,
  PublicationSession,
  SubscriberSessionAsPromised,
} from 'rascal';

import {
  AMQP_HOSTNAME,
  AMQP_PASSWORD,
  AMQP_PORT,
  AMQP_USER,
  AMQP_VHOST,
} from './environment';
import logger from './logger';

const config: BrokerConfig = {
  vhosts: {
    [AMQP_VHOST]: {
      bindings: [
        'newAlbums -> populateAlbumCover',
        'newAlbums -> populateAlbumDate',
        'newAlbums -> populateAlbumStats',
        'newAlbums -> populateAlbumTags',
      ],
      connection: {
        hostname: AMQP_HOSTNAME,
        options: {
          heartbeat: 5,
        },
        password: AMQP_PASSWORD,
        port: AMQP_PORT,
        protocol: 'amqp',
        retry: {
          min: 1000,
          max: 60000,
          factor: 2,
          strategy: 'exponential',
        },
        slashes: true,
        socketOptions: {
          timeout: 10000,
        },
        user: AMQP_USER,
        vhost: AMQP_VHOST,
      },
      exchanges: {
        newAlbums: {
          type: 'fanout',
        },
        newTags: {
          type: 'fanout',
        },
      },
      publications: {
        newAlbums: {
          exchange: 'newAlbums',
        },
        newTags: {
          exchange: 'newTags',
        },
      },
      queues: [
        'populateAlbumCover',
        'populateAlbumDate',
        'populateAlbumStats',
        'populateAlbumTags',
      ],
      subscriptions: {
        populateAlbumCover: {
          queue: 'populateAlbumCover',
        },
        populateAlbumDate: {
          queue: 'populateAlbumDate',
        },
        populateAlbumStats: {
          queue: 'populateAlbumStats',
        },
        populateAlbumTags: {
          queue: 'populateAlbumTags',
        },
      },
    },
  },
};

let brokerPromise: Promise<BrokerAsPromised> | undefined;

function getBroker(): Promise<BrokerAsPromised> {
  try {
    if (brokerPromise) {
      return brokerPromise;
    }
    brokerPromise = BrokerAsPromised.create(config).then((broker) => {
      broker.on('error', (error, { vhost, connectionUrl }) => {
        logger.error('Broker error', error, vhost, connectionUrl);
      });
      return broker;
    });
    return brokerPromise;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function publish(
  name: string,
  message: unknown,
): Promise<PublicationSession> {
  try {
    const broker = await getBroker();
    const publication = await broker.publish(name, message, {
      options: { contentType: 'application/json' },
    });

    publication.on('error', (error, messageId) => {
      logger.error('Publisher error', error, messageId);
    });
    publication.on('success', () =>
      logger.info(`Successfully published to ${name}`),
    );
    return publication;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function subscribe(
  name: string,
): Promise<SubscriberSessionAsPromised> {
  const broker = await getBroker();
  const subscription = await broker.subscribe(name, {
    contentType: 'application/json',
  });
  subscription.on('error', (error) => {
    logger.error(error);
  });
  return subscription;
}
